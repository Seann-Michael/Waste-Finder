import { Request, Response } from "express";

// In production, this would integrate with a proper geocoding service like Google Maps API
// For now, return a placeholder message for ZIP code searches

// Calculate distance using Haversine formula
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

// Mock location database
const mockLocations = [
  {
    id: "cleveland-1",
    name: "Cleveland West Municipal Landfill",
    address: "15600 Triskett Road",
    city: "Cleveland",
    state: "OH",
    zipCode: "44111",
    phone: "(216) 664-3060",
    email: "waste@clevelandohio.gov",
    website: "https://www.clevelandohio.gov",
    latitude: 41.4458,
    longitude: -81.7799,
    facilityType: "landfill",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit Card" },
      { id: "3", name: "Check" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Household Waste",
        category: "general",
        pricePerTon: 65,
      },
      { id: "2", name: "Yard Waste", category: "general", pricePerTon: 35 },
      { id: "3", name: "Appliances", category: "general", pricePerLoad: 25 },
      {
        id: "4",
        name: "Electronics",
        category: "recyclable",
        priceNote: "Free drop-off",
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
    notes: "Cleveland's primary municipal waste facility.",
    rating: 4.2,
    reviewCount: 89,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "cleveland-2",
    name: "West Side Recycling Center",
    address: "3200 W 65th Street",
    city: "Cleveland",
    state: "OH",
    zipCode: "44111",
    phone: "(216) 961-4700",
    latitude: 41.4419,
    longitude: -81.7879,
    facilityType: "transfer_station",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit Card" },
      { id: "3", name: "Check" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Household Waste",
        category: "general",
        pricePerTon: 60,
      },
      {
        id: "4",
        name: "Electronics",
        category: "recyclable",
        priceNote: "Free drop-off",
      },
      {
        id: "6",
        name: "Recyclables",
        category: "recyclable",
        priceNote: "Free drop-off",
      },
    ],
    operatingHours: [
      { dayOfWeek: 1, openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 2, openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 3, openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 4, openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 5, openTime: "08:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "14:00", isClosed: false },
      { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
    ],
    notes: "Specialized recycling center.",
    rating: 4.6,
    reviewCount: 142,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "cleveland-3",
    name: "Parma Transfer Station",
    address: "6161 Ackley Road",
    city: "Parma",
    state: "OH",
    zipCode: "44129",
    phone: "(440) 885-8181",
    latitude: 41.3784,
    longitude: -81.729,
    facilityType: "transfer_station",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit Card" },
    ],
    debrisTypes: [
      { id: "1", name: "General Waste", category: "general", pricePerTon: 55 },
      {
        id: "5",
        name: "Construction Debris",
        category: "construction",
        pricePerTon: 85,
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
    id: "cleveland-4",
    name: "East Side Transfer Station",
    address: "2100 E 55th Street",
    city: "Cleveland",
    state: "OH",
    zipCode: "44102",
    phone: "(216) 431-2100",
    latitude: 41.4919,
    longitude: -81.7357,
    facilityType: "transfer_station",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit Card" },
    ],
    debrisTypes: [
      {
        id: "1",
        name: "General Household Waste",
        category: "general",
        pricePerTon: 58,
      },
      { id: "2", name: "Yard Waste", category: "general", pricePerTon: 32 },
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
    facilityType: "landfill",
    paymentTypes: [
      { id: "1", name: "Cash" },
      { id: "2", name: "Credit Card" },
      { id: "3", name: "Check" },
    ],
    debrisTypes: [
      { id: "1", name: "General Waste", category: "general", pricePerTon: 60 },
      { id: "2", name: "Yard Waste", category: "general", pricePerTon: 30 },
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
      facilityType,
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

    // Apply facility type filter
    if (facilityType && facilityType !== "all") {
      locations = locations.filter(
        (location) => location.facilityType === facilityType,
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
    if (zipCode && zipCodeDatabase[zipCode as string]) {
      searchLocation = {
        zipCode,
        ...zipCodeDatabase[zipCode as string],
        radius: parseInt(radius as string, 10),
      };
    }

    res.json({
      success: true,
      data: locations,
      total: locations.length,
      searchLocation,
      message: searchLocation
        ? `Found ${locations.length} facilities within ${radius} miles of ${zipCode}`
        : `Found ${locations.length} facilities`,
    });
  } catch (error) {
    console.error("Error in locations search:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
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
