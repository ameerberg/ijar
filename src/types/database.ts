export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      cars: {
        Row: Car;
        Insert: Omit<Car, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_trips'>;
        Update: Partial<Omit<Car, 'id' | 'created_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: never;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
      car_availability: {
        Row: CarAvailability;
        Insert: Omit<CarAvailability, 'id' | 'created_at'>;
        Update: Partial<Omit<CarAvailability, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  role: 'guest' | 'host' | 'admin';
  is_verified: boolean;
  joined_date: string;
  total_trips: number;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  host_id: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  color: string | null;
  license_plate: string | null;
  vin: string | null;
  transmission: 'automatic' | 'manual';
  fuel_type: 'electric' | 'gasoline' | 'diesel' | 'hybrid' | 'plugin-hybrid';
  seats: number;
  doors: number;
  category: 'sedan' | 'suv' | 'truck' | 'van' | 'minivan' | 'luxury' | 'sport' | 'convertible' | 'electric' | 'classic';
  description: string | null;
  features: string[];
  odometer: number;
  daily_rate: number;
  location_address: string | null;
  location_city: string | null;
  location_state: string | null;
  location_zip: string | null;
  location_country: string;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
  is_delivered: boolean;
  delivery_fee: number;
  delivery_radius: number;
  min_trip_duration: number;
  rating: number;
  total_trips: number;
  images: string[];
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  car_id: string;
  renter_id: string;
  host_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  pickup_location: string | null;
  return_location: string | null;
  is_delivered: boolean;
  delivery_address: string | null;
  daily_rate: number;
  total_days: number;
  subtotal: number;
  service_fee: number;
  delivery_fee: number;
  tax: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_intent_id: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string | null;
  car_id: string | null;
  reviewer_id: string;
  reviewee_id: string | null;
  review_type: 'car' | 'host' | 'renter';
  rating: number;
  comment: string | null;
  cleanliness_rating: number | null;
  communication_rating: number | null;
  accuracy_rating: number | null;
  value_rating: number | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  booking_id: string | null;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CarAvailability {
  id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  is_available: boolean;
  reason: string | null;
  created_at: string;
}

export interface CarWithHost extends Car {
  host: Profile;
  reviews: Review[];
}

export interface BookingWithDetails extends Booking {
  car: Car;
  host: Profile;
  renter: Profile;
}

export interface SearchFilters {
  location?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  category?: Car['category'];
  transmission?: Car['transmission'];
  fuelType?: Car['fuel_type'];
  seats?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  delivery?: boolean;
}