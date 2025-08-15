/**
 * Geocoding utilities for converting ZIP codes to coordinates
 * Uses multiple data sources for accurate location lookup
 */

interface GeocodingResult {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  formattedAddress?: string;
}

interface ZipCodeData {
  [zipCode: string]: {
    lat: number;
    lng: number;
    city: string;
    state: string;
  };
}

// Fallback ZIP code data for common areas (subset of US ZIP codes)
const fallbackZipData: ZipCodeData = {
  "10001": { lat: 40.7506, lng: -73.9972, city: "New York", state: "NY" },
  "90210": { lat: 34.0901, lng: -118.4065, city: "Beverly Hills", state: "CA" },
  "60601": { lat: 41.8825, lng: -87.6441, city: "Chicago", state: "IL" },
  "77001": { lat: 29.7749, lng: -95.3632, city: "Houston", state: "TX" },
  "85001": { lat: 33.4484, lng: -112.074, city: "Phoenix", state: "AZ" },
  "19101": { lat: 39.9526, lng: -75.1652, city: "Philadelphia", state: "PA" },
  "78701": { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
  "20001": { lat: 38.9072, lng: -77.0369, city: "Washington", state: "DC" },
  "02101": { lat: 42.3601, lng: -71.0589, city: "Boston", state: "MA" },
  "30301": { lat: 33.749, lng: -84.388, city: "Atlanta", state: "GA" },
};

/**
 * Geocode ZIP code to coordinates using multiple methods
 */
export async function geocodeZipCode(
  zipCode: string,
): Promise<GeocodingResult | null> {
  const cleanZip = zipCode.trim().padStart(5, "0");

  // Validate ZIP code format
  if (!/^\d{5}$/.test(cleanZip)) {
    throw new Error(
      "Invalid ZIP code format. Please enter a 5-digit ZIP code.",
    );
  }

  try {
    // Method 1: Try public geocoding API (zippopotam.us)
    const result = await geocodeWithZippopotamus(cleanZip);
    if (result) return result;
  } catch (error) {
    console.warn("Zippopotamus geocoding failed:", error);
  }

  try {
    // Method 2: Try Nominatim (OpenStreetMap)
    const result = await geocodeWithNominatim(cleanZip);
    if (result) return result;
  } catch (error) {
    console.warn("Nominatim geocoding failed:", error);
  }

  // Method 3: Fallback to hardcoded data
  const fallbackData = fallbackZipData[cleanZip];
  if (fallbackData) {
    return {
      lat: fallbackData.lat,
      lng: fallbackData.lng,
      city: fallbackData.city,
      state: fallbackData.state,
      formattedAddress: `${fallbackData.city}, ${fallbackData.state} ${cleanZip}`,
    };
  }

  throw new Error(
    `Unable to find coordinates for ZIP code ${cleanZip}. Please try a different ZIP code.`,
  );
}

/**
 * Geocode using zippopotam.us API
 */
async function geocodeWithZippopotamus(
  zipCode: string,
): Promise<GeocodingResult | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.places && data.places.length > 0) {
      const place = data.places[0];
      return {
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude),
        city: place["place name"],
        state: place["state abbreviation"],
        formattedAddress: `${place["place name"]}, ${place["state abbreviation"]} ${zipCode}`,
      };
    }

    return null;
  } catch (error) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Geocode using Nominatim (OpenStreetMap)
 */
async function geocodeWithNominatim(
  zipCode: string,
): Promise<GeocodingResult | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&postalcode=${zipCode}&limit=1`,
      {
        headers: {
          "User-Agent": "WasteFinder/1.0 (https://wastefinderapp.com)",
        },
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.length > 0) {
      const place = data[0];
      return {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        formattedAddress: place.display_name,
      };
    }

    return null;
  } catch (error) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Validate ZIP code format
 */
export function isValidZipCode(zipCode: string): boolean {
  return /^\d{5}$/.test(zipCode.trim());
}

/**
 * Format ZIP code to 5 digits with leading zeros
 */
export function formatZipCode(zipCode: string): string {
  return zipCode.trim().padStart(5, "0");
}
