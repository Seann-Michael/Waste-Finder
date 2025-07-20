/**
 * Enhanced Toast Notification Hook
 * Provides convenient methods for different types of notifications
 * with consistent styling and behavior across the application
 */
import { toast } from "@/hooks/use-toast";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

/**
 * Enhanced toast notifications with predefined types
 * Usage: const { showSuccess, showError, showWarning, showInfo } = useToastNotifications();
 */
export function useToastNotifications() {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast({
      variant: "success" as any,
      title: options?.title || "Success",
      description: message,
      duration: options?.duration || 5000,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast({
      variant: "destructive",
      title: options?.title || "Error",
      description: message,
      duration: options?.duration || 7000,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast({
      variant: "warning" as any,
      title: options?.title || "Warning",
      description: message,
      duration: options?.duration || 6000,
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast({
      variant: "info" as any,
      title: options?.title || "Information",
      description: message,
      duration: options?.duration || 5000,
    });
  };

  /**
   * Generic toast for custom configurations
   */
  const showToast = (
    message: string,
    options?: ToastOptions & { variant?: string },
  ) => {
    toast({
      variant: options?.variant as any,
      title: options?.title,
      description: message,
      duration: options?.duration || 5000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
  };
}
