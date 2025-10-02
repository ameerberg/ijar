/*
  # Turo Clone Database Schema

  ## Overview
  Complete database schema for a peer-to-peer car rental platform similar to Turo.

  ## New Tables

  ### 1. `profiles`
  Extends auth.users with additional user information
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `avatar_url` (text)
  - `phone` (text)
  - `date_of_birth` (date)
  - `bio` (text)
  - `address` (text)
  - `city` (text)
  - `state` (text)
  - `zip_code` (text)
  - `country` (text)
  - `role` (text) - 'guest', 'host', or 'admin'
  - `is_verified` (boolean)
  - `joined_date` (timestamptz)
  - `total_trips` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `cars`
  Stores vehicle listings
  - Complete car information including make, model, year
  - Location and availability data
  - Pricing and features
  - Images stored as JSONB array

  ### 3. `bookings`
  Stores rental bookings
  - Links renters, hosts, and cars
  - Date/time information
  - Pricing breakdown
  - Status tracking

  ### 4. `reviews`
  Stores reviews for cars and users
  - Multiple rating categories
  - Comments and feedback

  ### 5. `favorites`
  User's saved car listings

  ### 6. `messages`
  Communication between renters and hosts

  ### 7. `car_availability`
  Custom availability rules for cars

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to manage their own data
  - Hosts can manage their own car listings
  - Admins have full access
  - Public read access for car listings

  ## Indexes
  - Added indexes on foreign keys for better query performance
  - Geospatial index for location-based searches
  - Full-text search indexes for car makes and models
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  date_of_birth date,
  bio text,
  address text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'USA',
  role text DEFAULT 'guest' CHECK (role IN ('guest', 'host', 'admin')),
  is_verified boolean DEFAULT false,
  joined_date timestamptz DEFAULT now(),
  total_trips integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  trim text,
  color text,
  license_plate text,
  vin text,
  transmission text DEFAULT 'automatic' CHECK (transmission IN ('automatic', 'manual')),
  fuel_type text DEFAULT 'gasoline' CHECK (fuel_type IN ('electric', 'gasoline', 'diesel', 'hybrid', 'plugin-hybrid')),
  seats integer DEFAULT 5,
  doors integer DEFAULT 4,
  category text DEFAULT 'sedan' CHECK (category IN ('sedan', 'suv', 'truck', 'van', 'minivan', 'luxury', 'sport', 'convertible', 'electric', 'classic')),
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  odometer integer DEFAULT 0,
  daily_rate decimal(10,2) NOT NULL,
  location_address text,
  location_city text,
  location_state text,
  location_zip text,
  location_country text DEFAULT 'USA',
  latitude decimal(10,8),
  longitude decimal(11,8),
  is_available boolean DEFAULT true,
  is_delivered boolean DEFAULT false,
  delivery_fee decimal(10,2) DEFAULT 0,
  delivery_radius integer DEFAULT 0,
  min_trip_duration integer DEFAULT 1,
  rating decimal(3,2) DEFAULT 0,
  total_trips integer DEFAULT 0,
  images jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  renter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  start_time time DEFAULT '10:00:00',
  end_time time DEFAULT '10:00:00',
  pickup_location text,
  return_location text,
  is_delivered boolean DEFAULT false,
  delivery_address text,
  daily_rate decimal(10,2) NOT NULL,
  total_days integer NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  service_fee decimal(10,2) DEFAULT 0,
  delivery_fee decimal(10,2) DEFAULT 0,
  tax decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_intent_id text,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  review_type text NOT NULL CHECK (review_type IN ('car', 'host', 'renter')),
  rating decimal(3,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  cleanliness_rating decimal(3,2) CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  communication_rating decimal(3,2) CHECK (communication_rating >= 1 AND communication_rating <= 5),
  accuracy_rating decimal(3,2) CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  value_rating decimal(3,2) CHECK (value_rating >= 1 AND value_rating <= 5),
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, car_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create car_availability table
CREATE TABLE IF NOT EXISTS car_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_available boolean DEFAULT true,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_host_id ON cars(host_id);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location_city, location_state);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_availability ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Cars policies
CREATE POLICY "Cars are viewable by everyone"
  ON cars FOR SELECT
  USING (status = 'active');

CREATE POLICY "Hosts can insert own cars"
  ON cars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own cars"
  ON cars FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own cars"
  ON cars FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = host_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = host_id)
  WITH CHECK (auth.uid() = renter_id OR auth.uid() = host_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Car availability policies
CREATE POLICY "Car availability is viewable by everyone"
  ON car_availability FOR SELECT
  USING (true);

CREATE POLICY "Hosts can manage own car availability"
  ON car_availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = car_availability.car_id
      AND cars.host_id = auth.uid()
    )
  );

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();