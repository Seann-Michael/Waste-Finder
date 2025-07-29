import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "onLoad" | "onError"
  > {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  lazy?: boolean;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  onLoadComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * Optimized image component with lazy loading, error handling, and progressive enhancement
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc,
  placeholder,
  lazy = true,
  quality = 85,
  sizes,
  priority = false,
  onLoadComplete,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before the image comes into view
        threshold: 0.1,
      },
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback(() => {
    setIsError(true);
    onError?.("Failed to load image");
  }, [onError]);

  // Generate responsive image URLs (in a real app, this would be handled by your CDN)
  const generateResponsiveUrls = useCallback((originalSrc: string) => {
    // For now, return the original URL
    // In production, integrate with your image CDN (Cloudinary, Imgix, etc.)
    return {
      original: originalSrc,
      webp: originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
      avif: originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".avif"),
    };
  }, []);

  const imageUrls = generateResponsiveUrls(src);

  // Don't render anything if not in view and lazy loading is enabled
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={cn("bg-muted animate-pulse", className)}
        style={{ aspectRatio: "16/9" }}
      >
        {placeholder}
      </div>
    );
  }

  // Error state
  if (isError) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={cn("opacity-75", className)}
          onLoad={handleLoad}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground",
          className,
        )}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div
          className={cn("absolute inset-0 bg-muted animate-pulse", className)}
        >
          {placeholder}
        </div>
      )}

      {/* Progressive image enhancement with modern formats */}
      <picture>
        {/* AVIF format for modern browsers */}
        <source srcSet={imageUrls.avif} type="image/avif" />

        {/* WebP format for supported browsers */}
        <source srcSet={imageUrls.webp} type="image/webp" />

        {/* Fallback to original format */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          loading={lazy && !priority ? "lazy" : "eager"}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>
    </div>
  );
}

/**
 * Avatar image component with fallback initials
 */
interface AvatarImageProps {
  src?: string;
  alt: string;
  fallbackInitials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  fallbackInitials,
  size = "md",
  className,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-lg",
  };

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center rounded-full font-medium text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      >
        {fallbackInitials || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", sizeClasses[size], className)}
      onError={() => setHasError(true)}
      priority
    />
  );
}

/**
 * Hero image component for banners and headers
 */
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export function HeroImage({
  src,
  alt,
  className,
  overlay = false,
  children,
}: HeroImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        priority
      />

      {overlay && <div className="absolute inset-0 bg-black/30" />}

      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Gallery image component with zoom and lightbox support
 */
interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  zoomable?: boolean;
}

export function GalleryImage({
  src,
  alt,
  className,
  onClick,
  zoomable = true,
}: GalleryImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg cursor-pointer",
        zoomable && "group",
        className,
      )}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-transform duration-300",
          zoomable && "group-hover:scale-105",
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {zoomable && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-2">
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Logo image component with automatic sizing and fallback
 */
interface LogoImageProps {
  src: string;
  alt: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoImage({
  src,
  alt,
  variant = "light",
  size = "md",
  className,
}: LogoImageProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("w-auto object-contain", sizeClasses[size], className)}
      priority
      fallbackSrc="/placeholder-logo.svg" // Provide a default logo fallback
    />
  );
}
