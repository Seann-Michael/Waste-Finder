/**
 * Mock location data for development when Supabase is not configured
 */

export interface MockLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  location_type: "landfill" | "transfer_station" | "construction_landfill";
  notes?: string;
  rating?: number;
  review_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  debrisTypes?: any[];
  operatingHours?: any[];
  paymentTypes?: any[];
  reviews?: any[];
}

export const mockDebrisTypes = [
  {
    id: "1",
    name: "Construction Debris",
    description: "Concrete, drywall, lumber",
  },
  { id: "2", name: "Household Waste", description: "General household items" },
  {
    id: "3",
    name: "Yard Waste",
    description: "Leaves, branches, grass clippings",
  },
  { id: "4", name: "Electronics", description: "Computers, TVs, appliances" },
  {
    id: "5",
    name: "Hazardous Materials",
    description: "Paint, chemicals, batteries",
  },
];

export const mockPaymentTypes = [
  { id: "1", name: "Cash", description: "Cash payment accepted" },
  {
    id: "2",
    name: "Credit Card",
    description: "Visa, MasterCard, American Express",
  },
  { id: "3", name: "Check", description: "Personal or business checks" },
  { id: "4", name: "Account", description: "Account billing available" },
];

export const mockOperatingHours = [
  {
    id: "1",
    location_id: "1",
    day_of_week: 1,
    open_time: "07:00",
    close_time: "17:00",
    is_closed: false,
  },
  {
    id: "2",
    location_id: "1",
    day_of_week: 2,
    open_time: "07:00",
    close_time: "17:00",
    is_closed: false,
  },
  {
    id: "3",
    location_id: "1",
    day_of_week: 3,
    open_time: "07:00",
    close_time: "17:00",
    is_closed: false,
  },
  {
    id: "4",
    location_id: "1",
    day_of_week: 4,
    open_time: "07:00",
    close_time: "17:00",
    is_closed: false,
  },
  {
    id: "5",
    location_id: "1",
    day_of_week: 5,
    open_time: "07:00",
    close_time: "17:00",
    is_closed: false,
  },
  {
    id: "6",
    location_id: "1",
    day_of_week: 6,
    open_time: "08:00",
    close_time: "16:00",
    is_closed: false,
  },
  {
    id: "7",
    location_id: "1",
    day_of_week: 0,
    open_time: null,
    close_time: null,
    is_closed: true,
  },
];

export const mockLocations: MockLocation[] = [
  {
    id: "1",
    name: "Metro Waste Management Center",
    address: "1234 Industrial Blvd",
    city: "Phoenix",
    state: "AZ",
    zip_code: "85001",
    phone: "(602) 555-0123",
    email: "info@metrowaste.com",
    website: "https://metrowaste.com",
    latitude: 33.4484,
    longitude: -112.074,
    location_type: "landfill",
    notes:
      "Accepts construction debris, household waste, and yard waste. Scale available for accurate weighing.",
    rating: 4.2,
    review_count: 87,
    is_active: true,
    created_at: "2023-01-15T08:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    debrisTypes: [mockDebrisTypes[0], mockDebrisTypes[1], mockDebrisTypes[2]],
    paymentTypes: [
      mockPaymentTypes[0],
      mockPaymentTypes[1],
      mockPaymentTypes[2],
    ],
    operatingHours: mockOperatingHours.filter((h) => h.location_id === "1"),
    reviews: [],
  },
  {
    id: "2",
    name: "Desert View Transfer Station",
    address: "5678 Desert View Rd",
    city: "Scottsdale",
    state: "AZ",
    zip_code: "85250",
    phone: "(480) 555-0456",
    email: "contact@desertview.com",
    website: "https://desertviewtransfer.com",
    latitude: 33.5092,
    longitude: -111.8983,
    location_type: "transfer_station",
    notes:
      "Small loads welcome. Convenient drop-off for residential customers.",
    rating: 4.5,
    review_count: 142,
    is_active: true,
    created_at: "2023-02-20T09:15:00Z",
    updated_at: "2024-01-10T14:20:00Z",
    debrisTypes: [mockDebrisTypes[1], mockDebrisTypes[2], mockDebrisTypes[3]],
    paymentTypes: [mockPaymentTypes[0], mockPaymentTypes[1]],
    operatingHours: mockOperatingHours.map((h) => ({ ...h, location_id: "2" })),
    reviews: [],
  },
  {
    id: "3",
    name: "Valley Construction Disposal",
    address: "9012 Construction Way",
    city: "Mesa",
    state: "AZ",
    zip_code: "85204",
    phone: "(480) 555-0789",
    email: "disposal@valleyconst.com",
    website: "https://valleyconstruction.com",
    latitude: 33.4152,
    longitude: -111.8315,
    location_type: "construction_landfill",
    notes:
      "Specializes in construction and demolition debris. Large loads accepted.",
    rating: 4.0,
    review_count: 64,
    is_active: true,
    created_at: "2023-03-10T11:30:00Z",
    updated_at: "2024-01-05T16:45:00Z",
    debrisTypes: [mockDebrisTypes[0]],
    paymentTypes: [mockPaymentTypes[1], mockPaymentTypes[3]],
    operatingHours: mockOperatingHours.map((h) => ({ ...h, location_id: "3" })),
    reviews: [],
  },
  {
    id: "4",
    name: "Green Valley Recycling Center",
    address: "3456 Environmental Dr",
    city: "Tempe",
    state: "AZ",
    zip_code: "85281",
    phone: "(480) 555-0321",
    email: "recycle@greenvalley.com",
    website: "https://greenvalleyrecycling.com",
    latitude: 33.4255,
    longitude: -111.94,
    location_type: "transfer_station",
    notes:
      "Eco-friendly disposal and recycling services. Electronics recycling available.",
    rating: 4.7,
    review_count: 203,
    is_active: true,
    created_at: "2023-04-05T07:45:00Z",
    updated_at: "2024-01-12T09:15:00Z",
    debrisTypes: [mockDebrisTypes[2], mockDebrisTypes[3], mockDebrisTypes[4]],
    paymentTypes: [
      mockPaymentTypes[0],
      mockPaymentTypes[1],
      mockPaymentTypes[2],
    ],
    operatingHours: mockOperatingHours.map((h) => ({ ...h, location_id: "4" })),
    reviews: [],
  },
  {
    id: "5",
    name: "Sunrise Waste Solutions",
    address: "7890 Sunrise Blvd",
    city: "Chandler",
    state: "AZ",
    zip_code: "85225",
    phone: "(480) 555-0654",
    email: "info@sunrisewaste.com",
    website: "https://sunrisewaste.com",
    latitude: 33.3062,
    longitude: -111.8413,
    location_type: "landfill",
    notes:
      "Full-service waste management facility. Hazardous waste disposal available.",
    rating: 3.8,
    review_count: 95,
    is_active: true,
    created_at: "2023-05-12T13:20:00Z",
    updated_at: "2024-01-08T11:40:00Z",
    debrisTypes: [mockDebrisTypes[1], mockDebrisTypes[4]],
    paymentTypes: [mockPaymentTypes[1], mockPaymentTypes[3]],
    operatingHours: mockOperatingHours.map((h) => ({ ...h, location_id: "5" })),
    reviews: [],
  },
  {
    id: "6",
    name: "North Phoenix Transfer",
    address: "2468 Cave Creek Rd",
    city: "Phoenix",
    state: "AZ",
    zip_code: "85032",
    phone: "(602) 555-0987",
    email: "transfer@northphx.com",
    website: "https://northphxwaste.com",
    latitude: 33.6119,
    longitude: -112.0242,
    location_type: "transfer_station",
    notes:
      "Residential and commercial waste accepted. Convenient northern location.",
    rating: 4.1,
    review_count: 78,
    is_active: true,
    created_at: "2023-06-18T10:10:00Z",
    updated_at: "2024-01-03T15:25:00Z",
    debrisTypes: [mockDebrisTypes[1], mockDebrisTypes[2]],
    paymentTypes: [mockPaymentTypes[0], mockPaymentTypes[1]],
    operatingHours: mockOperatingHours.map((h) => ({ ...h, location_id: "6" })),
    reviews: [],
  },
];

/**
 * Check if we're using mock data (when Supabase is not configured)
 */
export function isMockMode(): boolean {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.VITE_SUPABASE_ADMIN_KEY;

  const isPlaceholder = (value: string | undefined) =>
    !value ||
    value.startsWith("YOUR_") ||
    value === "your_supabase_" ||
    value.length < 10;

  return (
    !supabaseUrl ||
    !supabaseServiceKey ||
    isPlaceholder(supabaseUrl) ||
    isPlaceholder(supabaseServiceKey)
  );
}
