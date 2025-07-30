import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number to (XXX) XXX-XXXX format
 * Accepts various input formats: 4401231234, 440-123-1234, 14401231234, +14401231234, etc.
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Handle different input lengths
  let cleanDigits = digits;

  // If starts with 1 and has 11 digits, remove the 1 (US country code)
  if (digits.length === 11 && digits.startsWith("1")) {
    cleanDigits = digits.slice(1);
  }

  // Must have exactly 10 digits for US format
  if (cleanDigits.length !== 10) {
    return phone; // Return original if can't format
  }

  // Format as (XXX) XXX-XXXX
  return `(${cleanDigits.slice(0, 3)}) ${cleanDigits.slice(3, 6)}-${cleanDigits.slice(6)}`;
}

/**
 * Converts a string to SEO-friendly URL slug
 * Removes special characters, spaces become hyphens, lowercase
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates SEO-friendly location URL
 * Format: /location/state/city/location-name
 */
export function generateLocationUrl(location: { state: string; city: string; name: string }): string {
  const state = createSlug(location.state);
  const city = createSlug(location.city);
  const name = createSlug(location.name);
  return `/location/${state}/${city}/${name}`;
}

/**
 * Extracts location data from SEO URL parameters
 */
export function parseLocationFromUrl(params: { state?: string; city?: string; locationName?: string }) {
  if (!params.state || !params.city || !params.locationName) {
    return null;
  }

  return {
    state: params.state.replace(/-/g, ' '),
    city: params.city.replace(/-/g, ' '),
    name: params.locationName.replace(/-/g, ' ')
  };
}

/**
 * Validates and normalizes phone numbers
 * Returns true if phone number is valid (10-15 digits)
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\D/g, "");
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Validates and normalizes URLs
 * Accepts URLs with or without protocol, with or without www
 */
export function validateAndFormatUrl(url: string): {
  isValid: boolean;
  formattedUrl: string;
} {
  if (!url) return { isValid: false, formattedUrl: "" };

  let normalizedUrl = url.trim();

  // Add protocol if missing
  if (!normalizedUrl.match(/^https?:\/\//)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const urlObj = new URL(normalizedUrl);
    return {
      isValid: true,
      formattedUrl: urlObj.toString(),
    };
  } catch {
    return { isValid: false, formattedUrl: url };
  }
}
