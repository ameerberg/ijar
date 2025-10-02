# Usage Guide - Turo Clone

## Quick Start

### Accessing the Application

1. **Start the development server** (automatically started)
2. **Navigate to** `http://localhost:5173`

The homepage will load with the hero section and car listings.

## Navigation Guide

### Public Pages (No Authentication Required)

#### 1. Homepage (`/`)
- **Search Bar**: Enter location, select dates and times
- **Filter Bar**: Click category buttons (All, Airports, Monthly, etc.)
- **Car Listings**: Scroll through featured cars
- **Car Cards**: Click any car to view details

#### 2. Car Detail Page (`/cars/:id`)
To access:
- Click any car card on the homepage
- URL example: `/cars/1`

Features:
- View car photos (use arrow buttons to navigate)
- See car specifications (seats, transmission, fuel type)
- Check host information and rating
- Select trip dates and times
- View price breakdown
- Click "Continue" to proceed with booking (requires login)

#### 3. Sign Up Page (`/signup`)
To access:
- Click hamburger menu (☰) in top right
- Select "Sign up"
- Or navigate directly to `/signup`

Create account with:
- Full name
- Email address
- Password (minimum 6 characters)
- Confirm password

#### 4. Login Page (`/login`)
To access:
- Click hamburger menu (☰) in top right
- Select "Log in"
- Or navigate directly to `/login`

Login with:
- Email address
- Password

### Authenticated Pages

#### 5. Host Dashboard (`/host-dashboard`)
To access:
- Click hamburger menu (☰) in top right
- Select "Become a host"
- Or navigate directly to `/host-dashboard`

**Requirements**: User must be logged in

Features:
- **Dashboard Overview**:
  - Total earnings
  - Active cars count
  - Upcoming trips
  - Total trips

- **My Cars Tab**:
  - View all your listed cars
  - Add new car (click "Add Car" button)
  - Edit car details (click edit icon)
  - Delete car (click trash icon)
  - View car details (click eye icon)

- **Bookings Tab**:
  - View all bookings for your cars
  - See booking status (pending, confirmed, active, completed)
  - Check payment status
  - View booking details

- **Earnings Tab**:
  - Total earnings overview
  - This month's earnings
  - Pending payments
  - Earnings breakdown

#### 6. Admin Panel (`/admin`)
To access:
- Navigate directly to `/admin`
- Or click hamburger menu if admin role is set

**Requirements**: User must be logged in with `admin` role

Features:
- **Statistics Tab**:
  - User growth metrics
  - Car listing statistics
  - Booking status overview
  - Revenue analytics

- **Users Tab**:
  - View all users
  - Search users
  - See user roles (guest, host, admin)
  - Check verification status
  - View trip counts

- **Cars Tab**:
  - View all car listings
  - Monitor car status
  - See host information

- **Bookings Tab**:
  - View all platform bookings
  - Check booking and payment status
  - Monitor booking dates and amounts

## User Roles

### Guest (Default)
- Browse car listings
- Search and filter cars
- View car details
- Create bookings
- Leave reviews
- Message hosts

### Host
All guest features plus:
- List cars for rent
- Manage car availability
- Set pricing
- View earnings
- Manage bookings
- Respond to renters

### Admin
All features plus:
- Access admin panel
- View platform statistics
- Manage all users
- Moderate content
- View all bookings
- Platform oversight

## Key Features to Test

### 1. Search Functionality
- Enter location in search bar
- Select start and end dates
- Choose pickup and return times
- Click search button

### 2. Filtering
- Click category buttons:
  - **All**: Show all cars
  - **Airports**: Cars near airports
  - **Monthly**: Long-term rentals
  - **Nearby**: Cars in your area
  - **Delivered**: Cars with delivery option
  - **Cities**: Cars in major cities

### 3. Booking Flow
1. Select a car from homepage
2. Choose trip dates on detail page
3. View price calculation (updates automatically)
4. Click "Continue" to proceed
5. Login if not authenticated

### 4. Host Features
1. Navigate to host dashboard
2. Click "Add Car" to list a vehicle
3. View bookings in Bookings tab
4. Check earnings in Earnings tab

### 5. Admin Features
1. Navigate to admin panel
2. View statistics dashboard
3. Search and filter users
4. Monitor all cars and bookings

## Sample Data

The application includes mock data for testing:

### Sample Cars:
1. **Mercedes-Benz EQS 2024**
   - Location: Los Angeles, CA
   - Daily Rate: $342
   - Category: Luxury
   - Features: Electric, Automatic, 5 seats

2. **Kia Sedona 2017**
   - Location: Los Angeles, CA
   - Daily Rate: $171
   - Category: Minivan
   - Features: Gasoline, Automatic, 7 seats

3. **Nissan Altima 2025**
   - Location: Los Angeles, CA
   - Daily Rate: $208
   - Category: Sedan
   - Features: Gasoline, Automatic, 5 seats

4. **Dodge Challenger 2021**
   - Location: Los Angeles, CA
   - Daily Rate: $242
   - Category: Sport
   - Features: Gasoline, Automatic, 5 seats

5. **Ford Bronco Sport 2023**
   - Location: Honolulu, HI
   - Daily Rate: $131
   - Category: SUV
   - Features: Gasoline, Automatic, 5 seats

6. **Tesla Model 3 2020**
   - Location: Honolulu, HI
   - Daily Rate: $117
   - Category: Electric
   - Features: Electric, Automatic, 5 seats

## Menu Navigation

### Main Menu (Hamburger Icon)
Click the menu icon (☰) in the top right corner to access:

**Not Logged In:**
- Log in
- Sign up
- Become a host
- Ask Turo
- Why choose Turo
- Gift cards
- Contact support
- Legal
- Insurance & protection
- Host tools
- Calculator

**Logged In:**
- User profile section
- All menu items above
- Sign out (at bottom)

## Footer Links

Organized by category:
- **Turo**: About, Team, Policies, Careers, Press
- **Locations**: USA, Australia, Canada, France, UK
- **Explore**: Why choose Turo, Weddings, Trust & safety
- **Hosting**: List your car, Calculator, Host tools
- **Social**: Facebook, Instagram, YouTube

## Tips for Testing

1. **Database Connection**: If Supabase is not configured, the app will use mock data for demonstration

2. **Authentication**: Without Supabase, authentication won't persist, but the UI can still be explored

3. **Navigation**: Use browser back/forward buttons or click links

4. **Responsive Design**: Test on different screen sizes (resize browser window)

5. **Interactive Elements**: Hover over buttons and cards to see transitions

## Troubleshooting

### Can't Log In
- Check if Supabase credentials are configured in `.env`
- Verify database schema is applied
- Try creating a new account first

### No Cars Showing
- The app will show mock data if database is empty
- Check console for any errors

### Pages Not Loading
- Verify development server is running
- Check browser console for errors
- Clear browser cache

### Role-Based Access
- New users default to 'guest' role
- Admin role must be set directly in database
- Host role can be self-assigned via "Become a host"

## Database Setup (If Needed)

If you need to set up the database:

1. **Create Supabase Project**: Sign up at supabase.com
2. **Run Migration**: Execute `supabase/migrations/20250930000000_create_turo_clone_schema.sql`
3. **Update .env**: Add your Supabase URL and anon key
4. **Restart Server**: Stop and start the development server

## Support

For issues or questions:
- Check browser console for errors
- Verify environment variables are set
- Review database schema is correctly applied
- Check that Row Level Security policies are active