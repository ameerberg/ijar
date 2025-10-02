# Turo Clone - Complete Car Rental Platform

A full-featured peer-to-peer car rental marketplace application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### User Features
- **Authentication System**: Email/password authentication with secure session management
- **User Roles**: Three distinct roles - Guest, Host, and Admin
- **Profile Management**: Complete user profiles with avatar, bio, and contact information
- **Car Search**: Advanced search with location, dates, and filters
- **Browse Listings**: View cars by category, location, airports, and delivery options
- **Car Details**: Comprehensive car information with image gallery, features, and host details
- **Booking System**: Date/time selection with automatic price calculation including fees and taxes
- **Favorites**: Save preferred car listings for later
- **Reviews & Ratings**: Multi-criteria rating system for cars and users
- **Messaging**: In-app communication between renters and hosts

### Host Features
- **Host Dashboard**: Central management panel for all hosting activities
- **Car Listings**: Add, edit, and manage vehicle listings
- **Calendar Management**: Control car availability with custom date ranges
- **Booking Management**: View and manage all bookings
- **Earnings Tracking**: Monitor revenue and payment status
- **Analytics**: Track trips, ratings, and performance metrics

### Admin Features
- **Admin Panel**: Comprehensive platform management dashboard
- **User Management**: View and manage all platform users
- **Car Oversight**: Monitor and manage all vehicle listings
- **Booking Control**: Oversee all platform bookings
- **Platform Statistics**: Real-time metrics on users, cars, bookings, and revenue
- **Content Moderation**: Review and manage user-generated content

## Technology Stack

### Frontend
- **React 18**: Modern UI with hooks and functional components
- **TypeScript**: Type-safe code with full IntelliSense support
- **Tailwind CSS**: Utility-first styling with responsive design
- **Lucide React**: Beautiful, consistent iconography
- **Vite**: Fast development and optimized production builds

### Backend
- **Supabase**: Complete backend solution
  - PostgreSQL database with Row Level Security
  - Real-time subscriptions
  - Authentication and user management
  - RESTful API with automatic generation

### Database Schema
Complete schema with 7 main tables:
1. **profiles**: Extended user information
2. **cars**: Vehicle listings with location, pricing, features
3. **bookings**: Rental bookings with pricing breakdown
4. **reviews**: Multi-criteria reviews for cars and users
5. **favorites**: User's saved listings
6. **messages**: Communication between users
7. **car_availability**: Custom availability rules

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Main navigation header
│   ├── Footer.tsx      # Site footer with links
│   ├── SearchBar.tsx   # Car search component
│   ├── FilterBar.tsx   # Category filters
│   └── CarCard.tsx     # Car listing card
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/                # Utilities and configuration
│   └── supabase.ts     # Supabase client setup
├── pages/              # Page components
│   ├── HomePage.tsx           # Main landing page
│   ├── CarDetailPage.tsx      # Car details and booking
│   ├── HostDashboard.tsx      # Host management panel
│   ├── AdminPanel.tsx         # Admin control panel
│   ├── LoginPage.tsx          # User login
│   └── SignUpPage.tsx         # User registration
├── types/              # TypeScript definitions
│   └── database.ts     # Database types and interfaces
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles

supabase/
└── migrations/         # Database migrations
    └── 20250930000000_create_turo_clone_schema.sql
```

## Key Features Implementation

### 1. Homepage
- Hero section with search functionality
- Category filters (All, Airports, Monthly, Nearby, Delivered, Cities)
- Featured car listings by location
- Footer with comprehensive site navigation

### 2. Car Detail Page
- Image gallery with navigation
- Comprehensive car information (seats, transmission, fuel type)
- Host profile with rating and trip count
- Booking widget with date/time selection
- Dynamic price calculation
- Feature list with visual indicators
- Pickup/return location details

### 3. Host Dashboard
- Statistics overview (earnings, active cars, bookings, trips)
- Three main sections:
  - **My Cars**: Manage vehicle listings
  - **Bookings**: View and manage reservations
  - **Earnings**: Track revenue and payments
- Action buttons for adding cars and managing listings

### 4. Admin Panel
- Platform-wide statistics dashboard
- User management table with search
- Car listings overview
- Booking management with status tracking
- Multi-tab interface for organized navigation

### 5. Authentication
- Secure email/password authentication
- Session management with auto-refresh
- Role-based access control
- Profile auto-creation on signup

## Design Principles

### Visual Design
- Clean, modern interface inspired by Turo
- Consistent color scheme with teal/blue gradients
- Professional typography and spacing
- High-quality stock images from Pexels
- Smooth transitions and hover effects

### User Experience
- Intuitive navigation with clear hierarchy
- Responsive design for all screen sizes
- Fast page loads with optimized images
- Clear call-to-action buttons
- Helpful error messages and loading states

### Code Quality
- Modular component architecture
- Type-safe TypeScript throughout
- Reusable components and utilities
- Clean separation of concerns
- Consistent naming conventions

## Database Security

### Row Level Security (RLS)
All tables implement RLS policies:
- Users can only access their own data
- Hosts manage their own car listings
- Public read access for active listings
- Secure booking and payment information

### Data Validation
- Input validation on all forms
- Type checking with TypeScript
- Database constraints and checks
- Foreign key relationships

## Setup Instructions

### 1. Database Setup
Run the migration file in your Supabase project:
```bash
psql -h [your-supabase-host] -U postgres -f supabase/migrations/20250930000000_create_turo_clone_schema.sql
```

Or use the Supabase dashboard to execute the SQL.

### 2. Environment Variables
The project uses:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are configured in `.env` file.

### 3. Install and Run
```bash
npm install
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

## Navigation

The application uses a client-side router with these routes:
- `/` - Homepage
- `/cars/:id` - Car detail page
- `/login` - Login page
- `/signup` - Sign up page
- `/host-dashboard` - Host dashboard (requires authentication)
- `/admin` - Admin panel (requires admin role)

## Sample Data

The application includes mock data for demonstration:
- 6+ sample car listings
- Various car categories (luxury, sedan, SUV, electric, sport)
- Different locations (Los Angeles, Honolulu)
- Price ranges from $117-$342 per day

## Future Enhancements

Potential features for expansion:
1. Real-time messaging system
2. Payment integration (Stripe)
3. Advanced search filters
4. Map integration for location selection
5. Calendar availability view
6. Photo upload for car listings
7. Trip history and receipts
8. Insurance options
9. Verification system
10. Mobile app versions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Fast page loads with Vite
- Optimized bundle size
- Lazy loading for images
- Efficient database queries with indexes
- CDN-ready static assets

## Security Best Practices

- Passwords hashed with bcrypt
- JWT tokens for session management
- HTTPS required for production
- Input sanitization
- XSS protection
- CSRF tokens
- Rate limiting on API endpoints
- Secure environment variables

## Contributing

This is a demonstration project showcasing:
- Modern React development
- TypeScript best practices
- Supabase integration
- Responsive design
- Role-based access control
- Complex state management

## License

This is a clone/demonstration project for educational purposes.