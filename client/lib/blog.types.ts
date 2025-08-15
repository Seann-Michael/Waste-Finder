export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author_name: string
  author_email?: string
  featured_image?: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  published_at: string
  created_at: string
  updated_at: string
  view_count: number
  like_count: number
  read_time_minutes: number
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  post_count: number
  created_at: string
}

export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
  parent_id?: string
  replies?: BlogComment[]
}

export interface BlogSearchParams {
  search?: string
  category?: string
  tag?: string
  author?: string
  page?: number
  limit?: number
  sortBy?: 'published_at' | 'view_count' | 'like_count' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface BlogSearchResponse {
  posts: BlogPost[]
  categories: BlogCategory[]
  total: number
  page: number
  limit: number
  pages: number
  totalPages: number
}
