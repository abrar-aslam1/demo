export interface VendorReview {
  rating: number
  text: string
  author: string
  date: string
}

export interface VendorCategory {
  slug: string
  name: string
}

export type Vendor = {
    id: string;
    name: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    address?: string;
    phone?: string;
    website?: string;
    businessHours?: Record<string, string>;
    priceRange?: string;
    description: string;
    reviews?: VendorReview[];
    category: string;
}

export interface Location {
  city_ascii: string;
  city: string;
  state_name: string;
  // ... any other properties
}

export interface DataForSEOResponse {
  status_code: number;
  status_message: string;
  tasks?: Array<{
    id: string;
    result?: Array<{
      items?: Array<{
        place_id?: string;
        title: string;
        rating?: { value: number; votes: number };
        phone?: string;
        website?: string;
        address?: string;
        snippet?: string;
        photos?: string[];
        schedule?: Record<string, string>;
        price_level?: string
      }>;
    }>;
  }>;
}

export interface DataForSEOItem {
  place_id: string;
  title: string;
  rating?: {
    value: number;
    votes_count: number;
  };
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  photos?: string[];
  schedule?: Record<string, string>;
  price_level?: string;
} 