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
import { 
  getAllLocations, 
  getFilteredLocations, 
  getLocationById, 
  addLocation, 
  updateLocation, 
  deleteLocation, 
  toggleLocationStatus 
} from "../lib/supabaseService.js";

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
 * Sanitizes input data to prevent XSS and other security issues
 */
function sanitize(input: string): string {
  return input.toString().trim().replace(/[<>]/g, "");
}

/**
 * Validates location data structure and required fields
 */
function validateLocationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push("Name is required and must be at least 2 characters long");
  }

  if (!data.address || typeof data.address !== "string" || data.address.trim().length < 5) {
    errors.push("Address is required and must be at least 5 characters long");
  }

  if (!data.city || typeof data.city !== "string" || data.city.trim().length < 2) {
    errors.push("City is required and must be at least 2 characters long");
  }

  if (!data.state || typeof data.state !== "string" || data.state.length !== 2) {
    errors.push("State is required and must be a 2-letter state code");
  }

  if (data.zipCode && (typeof data.zipCode !== "string" || !/^\d{5}(-\d{4})?$/.test(data.zipCode))) {
    errors.push("ZIP code must be in format 12345 or 12345-6789");
  }

  if (data.phone && (typeof data.phone !== "string" || !/^\(\d{3}\) \d{3}-\d{4}$/.test(data.phone))) {
    errors.push("Phone number must be in format (555) 123-4567");
  }

  if (data.email && (typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
    errors.push("Email must be a valid email address");
  }

  if (data.website && (typeof data.website !== "string" || !data.website.startsWith("http"))) {
    errors.push("Website must be a valid URL starting with http or https");
  }

  if (data.latitude !== undefined) {
    const lat = parseFloat(data.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push("Latitude must be a number between -90 and 90");
    }
  }

  if (data.longitude !== undefined) {
    const lng = parseFloat(data.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push("Longitude must be a number between -180 and 180");
    }
  }

  if (!data.locationType || typeof data.locationType !== "string") {
    errors.push("Location type is required");
  } else {
    const validTypes = ["landfill", "transfer_station", "construction_landfill"];
    if (!validTypes.includes(data.locationType)) {
      errors.push(`Location type must be one of: ${validTypes.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes location data for database storage
 */
function sanitizeLocationData(data: any) {
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

// Location data now comes from Supabase database

// GET /api/locations - Get all locations or search by ZIP code
export async function handleLocationsSearch(req: Request, res: Response) {
  try {
    const {
      zipCode,
      radius = "50",
      locationType,
      debrisTypes,
      sortBy = "name",
    } = req.query;

    // Get locations from Supabase with filters
    const filters: any = {};
    if (locationType && typeof locationType === 'string') {
      filters.locationType = locationType;
    }
    
    let locations = await getFilteredLocations(filters);

    // Apply distance filtering if zipCode is provided
    if (zipCode && typeof zipCode === "string") {
      // This would require a geocoding service to convert ZIP to coordinates
      // For now, we'll return all locations
    }

    // Apply debris type filtering
    if (debrisTypes && typeof debrisTypes === "string") {
      const requestedTypes = debrisTypes.split(",");
      locations = locations.filter((location: any) =>
        location.debrisTypes?.some((debrisType: any) =>
          requestedTypes.some((requestedType: string) =>
            debrisType.name.toLowerCase().includes(requestedType.toLowerCase())
          )
        )
      );
    }

    // Sort locations
    locations.sort((a: any, b: any) => {
      switch (sortBy) {
        case "distance":
          return 0; // Would implement with coordinates
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    res.json({
      success: true,
      data: locations,
      count: locations.length,
      query: {
        zipCode,
        radius,
        locationType,
        debrisTypes,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Error searching locations:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * GET /api/locations/all - Get all locations with optional filtering and pagination
 */
export async function handleAllLocations(req: Request, res: Response) {
  try {
    const {
      search,
      page = "1",
      limit = "50",
      status = "active",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Get locations from Supabase with filters
    const filters: any = {};
    if (search && typeof search === 'string') {
      filters.search = search;
    }
    
    let filteredLocations = await getFilteredLocations(filters);

    // Filter by status
    if (status === "active") {
      filteredLocations = filteredLocations.filter((loc: any) => loc.isActive !== false);
    } else if (status === "inactive") {
      filteredLocations = filteredLocations.filter((loc: any) => loc.isActive === false);
    }

    // Sort locations
    filteredLocations.sort((a: any, b: any) => {
      let aValue = a[sortBy as string];
      let bValue = b[sortBy as string];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedLocations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredLocations.length,
        pages: Math.ceil(filteredLocations.length / limitNum),
      },
      filters: {
        search,
        status,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching all locations:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * POST /api/locations - Create new location
 * Requires authentication and locations.write permission
 */
export async function handleCreateLocation(req: Request, res: Response) {
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

    const newLocation = {
      ...sanitizedData,
      latitude: sanitizedData.latitude ? parseFloat(sanitizedData.latitude) : undefined,
      longitude: sanitizedData.longitude ? parseFloat(sanitizedData.longitude) : undefined,
      rating: 0,
      reviewCount: 0,
      isActive: sanitizedData.isActive !== false,
    };

    // Add to Supabase database
    const createdLocation = await addLocation(newLocation);
    
    if (!createdLocation) {
      return res.status(500).json({
        success: false,
        error: "Failed to create location in database",
      });
    }

    res.status(201).json({
      success: true,
      data: createdLocation,
      message: "Location created successfully",
    });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * PUT /api/locations/:id - Update existing location
 * Requires authentication and locations.write permission
 */
export async function handleUpdateLocation(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const validation = validateLocationData(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const sanitizedData = sanitizeLocationData(req.body);
    
    const updates = {
      ...sanitizedData,
      latitude: sanitizedData.latitude ? parseFloat(sanitizedData.latitude) : undefined,
      longitude: sanitizedData.longitude ? parseFloat(sanitizedData.longitude) : undefined,
    };
    
    // Update in Supabase database
    const updatedLocation = await updateLocation(id, updates);
    
    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        error: "Location not found or update failed",
      });
    }

    res.json({
      success: true,
      data: updatedLocation,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * DELETE /api/locations/:id - Delete location (soft delete)
 * Requires authentication and locations.delete permission
 */
export async function handleDeleteLocation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Soft delete in Supabase database
    const success = await deleteLocation(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Location not found or delete failed",
      });
    }

    res.json({
      success: true,
      message: "Location deleted successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * PATCH /api/locations/:id/status - Toggle location active status
 * Requires authentication and locations.write permission
 */
export async function handleToggleLocationStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "isActive must be a boolean value",
      });
    }

    // Update status in Supabase database
    const updatedLocation = await toggleLocationStatus(id, isActive);
    
    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        error: "Location not found or status update failed",
      });
    }

    res.json({
      success: true,
      message: `Location ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        id: updatedLocation.id,
        isActive: updatedLocation.isActive,
      },
    });
  } catch (error) {
    console.error("Error toggling location status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

/**
 * GET /api/locations/:id - Get location by ID
 */
export async function handleLocationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const location = await getLocationById(id);

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
    console.error("Error fetching location by ID:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
