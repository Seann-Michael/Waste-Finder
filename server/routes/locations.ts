/**
 * Location Management API Routes
 *
 * Purpose: Provides comprehensive CRUD operations for waste disposal locations
 * with search capabilities, filtering, and security features
 *
 * Security Features:
 * - Authentication required for write operations
 * - Permission-based access control
 * - Input validation and sanitization
 * - Rate limiting on search endpoints
 * - SQL injection protection
 *
 * Endpoints:
 * - GET /api/locations - Search and filter locations
 * - GET /api/locations/all - Get all locations with pagination
 * - GET /api/locations/:id - Get specific location
 * - POST /api/locations - Create new location (admin only)
 * - PUT /api/locations/:id - Update location (admin only)
 * - DELETE /api/locations/:id - Delete location (super admin only)
 * - PATCH /api/locations/:id/status - Toggle location status
 */

import { Request, Response } from "express";

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lng1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lng2 - Longitude of second point
 * @returns Distance in miles
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Validates location data for creation/update
 */
function validateLocationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!data.name || data.name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long");
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push("Address must be at least 5 characters long");
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.push("City is required");
  }

  if (!data.state || !/^[A-Z]{2}$/.test(data.state)) {
    errors.push("State must be a valid 2-letter code");
  }

  if (!data.zipCode || !/^\d{5}(-\d{4})?$/.test(data.zipCode)) {
    errors.push("ZIP code must be in format 12345 or 12345-6789");
  }

  if (!data.phone || !/^\(\d{3}\) \d{3}-\d{4}$/.test(data.phone)) {
    errors.push("Phone must be in format (555) 123-4567");
  }

  // Email validation (optional)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  // Website validation (optional)
  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.push("Website must start with http:// or https://");
  }

  // Coordinates validation
  const lat = parseFloat(data.latitude);
  const lng = parseFloat(data.longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("Latitude must be between -90 and 90");
  }

  if (isNaN(lng) || lng < -180 || lng > 180) {
    errors.push("Longitude must be between -180 and 180");
  }

  // Location type validation
  const validTypes = ["landfill", "transfer_station", "construction_landfill"];
  if (!data.locationType || !validTypes.includes(data.locationType)) {
    errors.push("Invalid location type");
  }

  // Payment types validation
  if (!data.paymentTypes || !Array.isArray(data.paymentTypes) || data.paymentTypes.length === 0) {
    errors.push("At least one payment type is required");
  }

  // Debris types validation
  if (!data.debrisTypes || !Array.isArray(data.debrisTypes) || data.debrisTypes.length === 0) {
    errors.push("At least one debris type is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes location data to prevent XSS and injection attacks
 */
function sanitizeLocationData(data: any): any {
  const sanitize = (str: string): string => {
    if (typeof str !== "string") return str;
    return str
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .substring(0, 500); // Limit length
  };

  return {
    ...data,
    name: sanitize(data.name),
    address: sanitize(data.address),
    city: sanitize(data.city),
    state: data.state?.toUpperCase(),
    notes: data.notes ? sanitize(data.notes) : "",
    email: data.email ? data.email.toLowerCase().trim() : "",
    website: data.website ? data.website.trim() : "",
  };
}

// Mock location database
const mockLocations = [
  {
    id: "location-1",
    name: "Municipal Waste Management Center",
    address: "1500 Industrial Drive",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    phone: "(555) 123-4567",
    email: "waste@springfield.gov",
    website: "https://www.springfield.gov",
    latitude: 39.7817,
    longitude: -89.6501,
    locationType: "landfill",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Check" },
      { id: "3", name: "Credit/Debit" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Household Waste",
        category: "general",
        price: 65.00,
        priceDetails: "per ton",
      },
      {
        id: "2",
        name: "Yard Waste",
        category: "general",
        price: 35.00,
        priceDetails: "per ton",
      },
      {
        id: "3",
        name: "Appliances",
        category: "general",
        price: 25.00,
        priceDetails: "per load",
      },
      {
        id: "4",
        name: "Electronics",
        category: "recyclable",
        price: 0.00,
        priceDetails: "Free drop-off",
      },
    ],
    operatingHours: [
      { dayOfWeek: 1, openTime: "07:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: 2, openTime: "07:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: 3, openTime: "07:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: 4, openTime: "07:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: 5, openTime: "07:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: 6, openTime: "08:00", closeTime: "14:00", isClosed: false },
      { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
    ],
    notes: "Primary municipal waste facility serving the metropolitan area.",
    rating: 4.2,
    reviewCount: 89,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "location-2",
    name: "Regional Recycling Center",
    address: "3200 Industrial Boulevard",
    city: "Springfield",
    state: "IL",
    zipCode: "62702",
    phone: "(555) 234-5678",
    latitude: 39.7567,
    longitude: -89.6301,
    locationType: "transfer_station",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Check" },
      { id: "3", name: "Credit/Debit" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Household Waste",
        category: "general",
        price: 60.00,
        priceDetails: "per ton",
      },
      {
        id: "4",
        name: "Electronics",
        category: "recyclable",
        price: 0.00,
        priceDetails: "Free drop-off",
      },
      {
        id: "6",
        name: "Recyclables",
        category: "recyclable",
        price: 0.00,
        priceDetails: "Free drop-off",
      },
    ],
    operatingHours: [
      { dayOfWeek: 1, openTime: "07:00", closeTime: "16:00", isClosed: false },
      { dayOfWeek: 2, openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 3, openTime: "06:30", closeTime: "15:30", isClosed: false },
      { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 5, openTime: "07:30", closeTime: "16:30", isClosed: false },
      { dayOfWeek: 6, openTime: "10:00", closeTime: "14:00", isClosed: false },
      { dayOfWeek: 0, openTime: "11:00", closeTime: "15:00", isClosed: false },
    ],
    notes: "Specialized recycling center.",
    rating: 4.6,
    reviewCount: 142,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "location-3",
    name: "Metro Transfer Station",
    address: "6161 Commerce Drive",
    city: "Springfield",
    state: "IL",
    zipCode: "62703",
    phone: "(555) 345-6789",
    latitude: 39.7317,
    longitude: -89.6701,
    locationType: "transfer_station",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit/Debit" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Waste",
        category: "general",
        price: 55.00,
        priceDetails: "per ton",
      },
      {
        id: "5",
        name: "Construction Debris",
        category: "construction",
        price: 85.00,
        priceDetails: "per ton",
      },
    ],
    operatingHours: [
      { dayOfWeek: 1, openTime: "06:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 2, openTime: "06:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 3, openTime: "06:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 4, openTime: "06:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 5, openTime: "06:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 6, openTime: "07:00", closeTime: "15:00", isClosed: false },
      { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
    ],
    rating: 3.8,
    reviewCount: 67,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "location-4",
    name: "Construction Waste Center",
    address: "2100 East Industrial Way",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    phone: "(555) 456-7890",
    latitude: 39.7890,
    longitude: -89.6234,
    locationType: "transfer_station",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit/Debit" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Household Waste",
        category: "general",
        price: 58.00,
        priceDetails: "per ton",
      },
      {
        id: "2",
        name: "Yard Waste",
        category: "general",
        price: 32.00,
        priceDetails: "per ton",
      },
    ],
    operatingHours: [
      { dayOfWeek: 1, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 2, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 3, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 4, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 5, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 6, openTime: "08:00", closeTime: "15:00", isClosed: false },
      { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
    ],
    rating: 4.1,
    reviewCount: 73,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: "springfield-1",
    name: "Green Valley Municipal Landfill",
    address: "1234 Waste Management Drive",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    phone: "(555) 123-4567",
    latitude: 39.7817,
    longitude: -89.6501,
    locationType: "landfill",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Check" },
      { id: "3", name: "Credit/Debit" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Waste",
        category: "general",
        price: 60.00,
        priceDetails: "per ton",
      },
      {
        id: "2",
        name: "Yard Waste",
        category: "general",
        price: 30.00,
        priceDetails: "per ton",
      },
    ],
    operatingHours: [
      { dayOfWeek: 1, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 2, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 3, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 4, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 5, openTime: "07:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 6, openTime: "08:00", closeTime: "15:00", isClosed: false },
      { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
    ],
    rating: 4.5,
    reviewCount: 127,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

// GET /api/locations - Get all locations or search by ZIP code
export function handleLocationsSearch(req: Request, res: Response) {
  try {
    const {
      zipCode,
      radius = "50",
      locationType,
      debrisTypes,
      sortBy = "name",
    } = req.query;

    let locations = [...mockLocations];

    // Note: In production, ZIP code searches would use a geocoding service
    // For now, return all locations when ZIP code is provided
    if (zipCode && typeof zipCode === "string" && /^\d{5}$/.test(zipCode)) {
      // TODO: Integrate with geocoding service (Google Maps API, etc.)
      // For now, show a message that ZIP code search requires integration
      console.log(
        `ZIP code search requested: ${zipCode} (requires geocoding service integration)`,
      );
    }

    // Apply location type filter
    if (locationType && locationType !== "all") {
      locations = locations.filter(
        (location) => location.locationType === locationType,
      );
    }

    // Apply debris types filter
    if (debrisTypes && typeof debrisTypes === "string") {
      const debrisTypesArray = debrisTypes.split(",");
      locations = locations.filter((location) =>
        debrisTypesArray.some((selectedType) =>
          location.debrisTypes.some((debris) =>
            debris.name.toLowerCase().includes(selectedType.toLowerCase()),
          ),
        ),
      );
    }

    // Apply sorting (if not already sorted by distance)
    if (!zipCode || zipCode === "") {
      locations.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "rating":
            return b.rating - a.rating;
          case "city":
            return a.city.localeCompare(b.city);
          default:
            return 0;
        }
      });
    }

    // Prepare search location info for response
    let searchLocation = null;
    let message = `Found ${locations.length} locations`;

    if (zipCode && typeof zipCode === "string" && /^\d{5}$/.test(zipCode)) {
      message = `Found ${locations.length} locations (ZIP code search requires geocoding service integration)`;
    }

    res.json({
      success: true,
      data: locations,
      total: locations.length,
      searchLocation,
      message,
    });
  } catch (error) {
    console.error("Error in locations search:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * GET /api/locations/all - Get all locations with pagination and search
 * Public endpoint with rate limiting
 */
export function handleAllLocations(req: Request, res: Response) {
  try {
    const {
      search,
      page = "1",
      limit = "50",
      status = "active",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    let filteredLocations = [...mockLocations];

    // Filter by status
    if (status === "active") {
      filteredLocations = filteredLocations.filter((loc) => loc.isActive);
    } else if (status === "inactive") {
      filteredLocations = filteredLocations.filter((loc) => !loc.isActive);
    }

    // Apply search filter
    if (search && typeof search === "string") {
      const searchTerm = search.toLowerCase().trim();
      if (searchTerm.length > 0) {
        filteredLocations = filteredLocations.filter(
          (location) =>
            location.name.toLowerCase().includes(searchTerm) ||
            location.city.toLowerCase().includes(searchTerm) ||
            location.state.toLowerCase().includes(searchTerm) ||
            location.zipCode.includes(searchTerm) ||
            location.locationType.toLowerCase().includes(searchTerm),
        );
      }
    }

    // Apply sorting
    filteredLocations.sort((a, b) => {
      const aValue = (a as any)[sortBy as string];
      const bValue = (b as any)[sortBy as string];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.localeCompare(bValue);
        return sortOrder === "desc" ? -result : result;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const result = aValue - bValue;
        return sortOrder === "desc" ? -result : result;
      }

      return 0;
    });

    // Apply pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedLocations,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredLocations.length / limitNum),
        totalItems: filteredLocations.length,
        itemsPerPage: limitNum,
        hasNextPage: endIndex < filteredLocations.length,
        hasPreviousPage: pageNum > 1,
      },
      meta: {
        searchTerm: search || null,
        sortBy,
        sortOrder,
        status,
      },
    });
  } catch (error) {
    console.error("Error fetching all locations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch locations",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * POST /api/locations - Create new location
 * Requires authentication and locations.write permission
 */
export function handleCreateLocation(req: Request, res: Response) {
  try {
    const validation = validateLocationData(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const sanitizedData = sanitizeLocationData(req.body);

    // Generate new ID
    const newId = `location_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newLocation = {
      id: newId,
      ...sanitizedData,
      latitude: parseFloat(sanitizedData.latitude),
      longitude: parseFloat(sanitizedData.longitude),
      rating: 0,
      reviewCount: 0,
      isActive: sanitizedData.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    mockLocations.push(newLocation);

    res.status(201).json({
      success: true,
      data: newLocation,
      message: "Location created successfully",
    });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create location",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * PUT /api/locations/:id - Update existing location
 * Requires authentication and locations.write permission
 */
export function handleUpdateLocation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const locationIndex = mockLocations.findIndex((loc) => loc.id === id);

    if (locationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Location not found",
      });
    }

    const validation = validateLocationData(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const sanitizedData = sanitizeLocationData(req.body);
    const existingLocation = mockLocations[locationIndex];

    const updatedLocation = {
      ...existingLocation,
      ...sanitizedData,
      latitude: parseFloat(sanitizedData.latitude),
      longitude: parseFloat(sanitizedData.longitude),
      updatedAt: new Date().toISOString(),
    };

    mockLocations[locationIndex] = updatedLocation;

    res.json({
      success: true,
      data: updatedLocation,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update location",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * DELETE /api/locations/:id - Delete location
 * Requires authentication and locations.delete permission (super admin only)
 */
export function handleDeleteLocation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const locationIndex = mockLocations.findIndex((loc) => loc.id === id);

    if (locationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Location not found",
      });
    }

    const deletedLocation = mockLocations[locationIndex];
    mockLocations.splice(locationIndex, 1);

    res.json({
      success: true,
      message: "Location deleted successfully",
      deletedLocation: {
        id: deletedLocation.id,
        name: deletedLocation.name,
      },
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete location",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * PATCH /api/locations/:id/status - Toggle location active status
 * Requires authentication and locations.write permission
 */
export function handleToggleLocationStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const locationIndex = mockLocations.findIndex((loc) => loc.id === id);

    if (locationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Location not found",
      });
    }

    mockLocations[locationIndex].isActive = Boolean(isActive);
    mockLocations[locationIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: {
        id: mockLocations[locationIndex].id,
        isActive: mockLocations[locationIndex].isActive,
      },
      message: `Location ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Error toggling location status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update location status",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

// GET /api/locations/:id - Get specific location
export function handleLocationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const location = mockLocations.find((loc) => loc.id === id);

    if (!location) {
      return res.status(404).json({
        success: false,
        error: "Location not found",
      });
    }

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error getting location by ID:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
