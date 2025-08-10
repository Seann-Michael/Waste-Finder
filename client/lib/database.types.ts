export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email?: string
  website?: string
  google_business_url?: string
  latitude: number
  longitude: number
  location_type: 'landfill' | 'transfer_station' | 'construction_landfill'
  notes?: string
  rating: number
  review_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Related data from joins
  operating_hours?: OperatingHours[]
  payment_types?: PaymentType[]
  debris_types?: DebrisType[]
  reviews?: Review[]
  distance?: number // calculated field for search results
}

export interface OperatingHours {
  id: string
  location_id: string
  day_of_week: number // 0-6, 0 = Sunday
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface Review {
  id: string
  location_id: string
  rating: number
  title: string
  content: string
  author_name: string
  author_email?: string
  is_approved: boolean
  is_moderated: boolean
  created_at: string
  moderated_at?: string
  moderated_by?: string
  moderator_note?: string
}

export interface LocationSuggestion {
  id: string
  location_id?: string
  suggestion_type: 'new_location' | 'edit_location'
  suggested_data: any // JSON data
  submitter_name: string
  submitter_email: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
  reviewer_note?: string
}

export interface PaymentType {
  id: string
  name: string
  description?: string
}

export interface DebrisType {
  id: string
  name: string
  description?: string
  category: 'general' | 'construction' | 'hazardous' | 'recyclable'
  price_per_ton?: number
  price_per_load?: number
  price_note?: string
}

export interface LocationPaymentType {
  location_id: string
  payment_type_id: string
  payment_type: PaymentType
}

export interface LocationDebrisType {
  location_id: string
  debris_type_id: string
  debris_type: DebrisType
}

// Search and filter interfaces
export interface LocationSearchParams {
  zipCode?: string
  latitude?: number
  longitude?: number
  radius?: number
  locationType?: string
  search?: string
  page?: number
  limit?: number
}

export interface LocationSearchResponse {
  success: boolean
  locations: Location[]
  totalCount: number
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  query?: LocationSearchParams
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: any
}
