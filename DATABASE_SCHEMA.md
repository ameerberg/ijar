# Database Schema - Turo Clone

## Overview

This document describes the complete database schema for the Turo clone application. The schema supports a peer-to-peer car rental marketplace with users, car listings, bookings, reviews, and messaging.

## Tables

### 1. profiles

Extends the auth.users table with additional user information.

**Columns:**
- `id` (uuid, PK) - References auth.users.id
- `full_name` (text) - User's full name
- `avatar_url` (text) - Profile picture URL
- `phone` (text) - Contact phone number
- `date_of_birth` (date) - Date of birth
- `bio` (text) - User biography
- `address` (text) - Street address
- `city` (text) - City
- `state` (text) - State/Province
- `zip_code` (text) - Postal code
- `country` (text) - Country (default: 'USA')
- `role` (text) - User role: 'guest', 'host', or 'admin'
- `is_verified` (boolean) - Verification status
- `joined_date` (timestamptz) - Account creation date
- `total_trips` (integer) - Total number of trips
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Public profiles are viewable by everyone
- Users can update their own profile
- Users can insert their own profile

---

### 2. cars

Stores vehicle listings from hosts.

**Columns:**
- `id` (uuid, PK)
- `host_id` (uuid, FK) - References profiles.id
- `make` (text) - Car manufacturer
- `model` (text) - Car model
- `year` (integer) - Model year
- `trim` (text) - Trim level
- `color` (text) - Exterior color
- `license_plate` (text)
- `vin` (text) - Vehicle Identification Number
- `transmission` (text) - 'automatic' or 'manual'
- `fuel_type` (text) - 'electric', 'gasoline', 'diesel', 'hybrid', 'plugin-hybrid'
- `seats` (integer) - Number of seats
- `doors` (integer) - Number of doors
- `category` (text) - Vehicle category
- `description` (text) - Car description
- `features` (jsonb) - Array of features
- `odometer` (integer) - Current mileage
- `daily_rate` (decimal) - Daily rental rate
- `location_address` (text)
- `location_city` (text)
- `location_state` (text)
- `location_zip` (text)
- `location_country` (text)
- `latitude` (decimal)
- `longitude` (decimal)
- `is_available` (boolean) - Available for booking
- `is_delivered` (boolean) - Can be delivered to renter
- `delivery_fee` (decimal)
- `delivery_radius` (integer) - Maximum delivery distance in miles
- `min_trip_duration` (integer) - Minimum rental period in days
- `rating` (decimal) - Average rating
- `total_trips` (integer) - Total completed trips
- `images` (jsonb) - Array of image URLs
- `status` (text) - 'active', 'inactive', or 'maintenance'
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Active cars are viewable by everyone
- Hosts can insert, update, and delete their own cars

---

### 3. bookings

Stores rental bookings between renters and hosts.

**Columns:**
- `id` (uuid, PK)
- `car_id` (uuid, FK) - References cars.id
- `renter_id` (uuid, FK) - References profiles.id
- `host_id` (uuid, FK) - References profiles.id
- `start_date` (timestamptz) - Rental start date/time
- `end_date` (timestamptz) - Rental end date/time
- `start_time` (time) - Pickup time
- `end_time` (time) - Return time
- `pickup_location` (text)
- `return_location` (text)
- `is_delivered` (boolean) - Whether car was delivered
- `delivery_address` (text)
- `daily_rate` (decimal) - Rate at time of booking
- `total_days` (integer) - Duration in days
- `subtotal` (decimal) - Base cost
- `service_fee` (decimal) - Platform service fee
- `delivery_fee` (decimal) - Delivery charge if applicable
- `tax` (decimal) - Tax amount
- `total_amount` (decimal) - Total charge
- `status` (text) - 'pending', 'confirmed', 'active', 'completed', 'cancelled'
- `payment_status` (text) - 'pending', 'paid', 'refunded'
- `payment_intent_id` (text) - Payment processor reference
- `special_requests` (text) - Renter's special requests
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Users can view their own bookings (as renter or host)
- Users can create bookings
- Renters and hosts can update bookings

---

### 4. reviews

Stores reviews for cars and users.

**Columns:**
- `id` (uuid, PK)
- `booking_id` (uuid, FK) - References bookings.id
- `car_id` (uuid, FK) - References cars.id
- `reviewer_id` (uuid, FK) - User leaving the review
- `reviewee_id` (uuid, FK) - User being reviewed
- `review_type` (text) - 'car', 'host', or 'renter'
- `rating` (decimal) - Overall rating (1-5)
- `comment` (text) - Review text
- `cleanliness_rating` (decimal) - 1-5
- `communication_rating` (decimal) - 1-5
- `accuracy_rating` (decimal) - 1-5
- `value_rating` (decimal) - 1-5
- `is_visible` (boolean) - Whether review is published
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Visible reviews are viewable by everyone
- Users can create reviews for their bookings
- Users can update their own reviews

---

### 5. favorites

Stores users' saved car listings.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK) - References profiles.id
- `car_id` (uuid, FK) - References cars.id
- `created_at` (timestamptz)

**Unique Constraint:** (user_id, car_id)

**RLS Policies:**
- Users can view their own favorites
- Users can add favorites
- Users can remove favorites

---

### 6. messages

Stores messages between renters and hosts.

**Columns:**
- `id` (uuid, PK)
- `booking_id` (uuid, FK) - References bookings.id
- `sender_id` (uuid, FK) - References profiles.id
- `receiver_id` (uuid, FK) - References profiles.id
- `message` (text) - Message content
- `is_read` (boolean) - Read status
- `created_at` (timestamptz)

**RLS Policies:**
- Users can view messages they sent or received
- Users can send messages
- Receivers can mark messages as read

---

### 7. car_availability

Stores custom availability rules for cars.

**Columns:**
- `id` (uuid, PK)
- `car_id` (uuid, FK) - References cars.id
- `start_date` (date)
- `end_date` (date)
- `is_available` (boolean)
- `reason` (text) - Why car is unavailable
- `created_at` (timestamptz)

**RLS Policies:**
- Availability is viewable by everyone
- Hosts can manage availability for their own cars

---

## Indexes

Performance indexes are created on:
- Foreign key columns (host_id, car_id, renter_id, etc.)
- Location fields (location_city, location_state)
- Category and status fields
- Date ranges for bookings

## Triggers

### Auto Profile Creation
When a user signs up via auth.users, a profile is automatically created in the profiles table.

### Updated Timestamps
All tables with `updated_at` columns have triggers that automatically update the timestamp on row updates.

## SQL Migration File

To apply this schema, use the Supabase migration tool:

```sql
-- See supabase/migrations/[timestamp]_create_turo_clone_schema.sql
```

## Notes

1. All tables use Row Level Security (RLS) for data access control
2. Foreign keys cascade on delete to maintain referential integrity
3. JSON columns (features, images) store arrays as JSONB for efficient querying
4. Decimal columns use appropriate precision for currency values
5. Geographic coordinates support location-based search features