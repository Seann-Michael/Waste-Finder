import { Request, Response } from "express";

// Mock comprehensive ZIP code database - in production this would be a proper geocoding service
const zipCodeDatabase: Record<
  string,
  { lat: number; lng: number; city: string; state: string }
> = {
  // Ohio ZIP codes (comprehensive Cleveland area)
  "44001": { lat: 41.6025, lng: -80.7698, city: "Ashtabula", state: "OH" },
  "44012": { lat: 41.6053, lng: -81.337, city: "Avon Lake", state: "OH" },
  "44035": { lat: 41.2367, lng: -81.8552, city: "Elyria", state: "OH" },
  "44102": { lat: 41.4919, lng: -81.7357, city: "Cleveland", state: "OH" },
  "44103": { lat: 41.4615, lng: -81.6473, city: "Cleveland", state: "OH" },
  "44104": { lat: 41.4556, lng: -81.6081, city: "Cleveland", state: "OH" },
  "44105": { lat: 41.4211, lng: -81.6279, city: "Cleveland", state: "OH" },
  "44106": { lat: 41.5081, lng: -81.6081, city: "Cleveland", state: "OH" },
  "44107": { lat: 41.4831, lng: -81.7357, city: "Cleveland", state: "OH" },
  "44108": { lat: 41.5247, lng: -81.6279, city: "Cleveland", state: "OH" },
  "44109": { lat: 41.4081, lng: -81.6773, city: "Cleveland", state: "OH" },
  "44110": { lat: 41.4556, lng: -81.5473, city: "Cleveland", state: "OH" },
  "44111": { lat: 41.4458, lng: -81.7799, city: "Cleveland", state: "OH" },
  "44112": { lat: 41.4819, lng: -81.6473, city: "Cleveland", state: "OH" },
  "44113": { lat: 41.4897, lng: -81.6934, city: "Cleveland", state: "OH" },
  "44114": { lat: 41.5039, lng: -81.6934, city: "Cleveland", state: "OH" },
  "44115": { lat: 41.4831, lng: -81.7023, city: "Cleveland", state: "OH" },
  "44116": { lat: 41.4615, lng: -81.8484, city: "Rocky River", state: "OH" },
  "44117": { lat: 41.4994, lng: -81.5473, city: "Cleveland", state: "OH" },
  "44118": {
    lat: 41.5247,
    lng: -81.5804,
    city: "Cleveland Heights",
    state: "OH",
  },
  "44119": { lat: 41.4211, lng: -81.5804, city: "Cleveland", state: "OH" },
  "44120": { lat: 41.5081, lng: -81.6081, city: "Cleveland", state: "OH" },
  "44121": {
    lat: 41.5247,
    lng: -81.5639,
    city: "Cleveland Heights",
    state: "OH",
  },
  "44122": { lat: 41.4831, lng: -81.5639, city: "Beachwood", state: "OH" },
  "44123": { lat: 41.3784, lng: -81.6081, city: "Parma", state: "OH" },
  "44124": { lat: 41.4556, lng: -81.5142, city: "Cleveland", state: "OH" },
  "44125": { lat: 41.4081, lng: -81.6473, city: "Cleveland", state: "OH" },
  "44126": { lat: 41.4211, lng: -81.7357, city: "Fairview Park", state: "OH" },
  "44127": { lat: 41.4719, lng: -81.6279, city: "Cleveland", state: "OH" },
  "44128": { lat: 41.4081, lng: -81.6081, city: "Cleveland", state: "OH" },
  "44129": { lat: 41.3784, lng: -81.729, city: "Parma", state: "OH" },
  "44130": { lat: 41.3784, lng: -81.7799, city: "Parma Heights", state: "OH" },
  "44131": { lat: 41.4081, lng: -81.7468, city: "Cleveland", state: "OH" },
  "44132": { lat: 41.4419, lng: -81.8023, city: "Strongsville", state: "OH" },
  "44133": { lat: 41.3615, lng: -81.8484, city: "North Royalton", state: "OH" },
  "44134": { lat: 41.3446, lng: -81.7799, city: "Parma", state: "OH" },
  "44135": { lat: 41.395, lng: -81.763, city: "Cleveland", state: "OH" },
  "44136": { lat: 41.3615, lng: -81.8153, city: "Strongsville", state: "OH" },
  "44137": { lat: 41.3279, lng: -81.6773, city: "Maple Heights", state: "OH" },
  "44138": {
    lat: 41.3446,
    lng: -81.6279,
    city: "Garfield Heights",
    state: "OH",
  },
  "44139": { lat: 41.395, lng: -81.6773, city: "Brooklyn", state: "OH" },
  "44140": { lat: 41.4081, lng: -81.8484, city: "Bay Village", state: "OH" },

  // Illinois ZIP codes
  "62701": { lat: 39.7817, lng: -89.6501, city: "Springfield", state: "IL" },
  "62702": { lat: 39.7567, lng: -89.6301, city: "Springfield", state: "IL" },
  "62703": { lat: 39.7317, lng: -89.6701, city: "Springfield", state: "IL" },
  "60601": { lat: 41.8781, lng: -87.6298, city: "Chicago", state: "IL" },
  "60602": { lat: 41.8789, lng: -87.6359, city: "Chicago", state: "IL" },

  // Other major cities
  "10001": { lat: 40.7505, lng: -73.9934, city: "New York", state: "NY" },
  "90210": { lat: 34.0901, lng: -118.4065, city: "Beverly Hills", state: "CA" },
  "33101": { lat: 25.7617, lng: -80.1918, city: "Miami", state: "FL" },
  "02101": { lat: 42.3601, lng: -71.0589, city: "Boston", state: "MA" },
  "98101": { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA" },
  "77001": { lat: 29.7604, lng: -95.3698, city: "Houston", state: "TX" },
};

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
      sortBy = "distance",
    } = req.query;

    let locations = [...mockLocations];

    // If ZIP code is provided, filter by distance
    if (zipCode && typeof zipCode === "string" && /^\d{5}$/.test(zipCode)) {
      const zipData = zipCodeDatabase[zipCode];

      if (zipData) {
        const radiusNum = parseInt(radius as string, 10);

        // Calculate distances and filter by radius
        locations = locations
          .map((location) => ({
            ...location,
            distance: calculateDistance(
              zipData.lat,
              zipData.lng,
              location.latitude,
              location.longitude,
            ),
          }))
          .filter((location) => location.distance <= radiusNum)
          .sort((a, b) => a.distance - b.distance); // Sort by distance
      } else {
        // ZIP code not found, return empty results
        return res.json({
          success: true,
          data: [],
          total: 0,
          searchLocation: null,
          message: `ZIP code ${zipCode} not found in our database.`,
        });
      }
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
