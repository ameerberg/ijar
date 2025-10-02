import { useState, useEffect } from 'react';
import { Plus, Car as CarIcon, Calendar, DollarSign, TrendingUp, CreditCard as Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Car, Booking } from '../types/database';

export function HostDashboard() {
  const { user, profile } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cars' | 'bookings' | 'earnings'>('cars');

  useEffect(() => {
    if (user) {
      loadHostData();
    }
  }, [user]);

  const loadHostData = async () => {
    try {
      if (!user?.id) return;

      const [carsResult, bookingsResult] = await Promise.all([
        supabase.from('cars').select('*').eq('host_id', user.id),
        supabase.from('bookings').select('*').eq('host_id', user.id),
      ]);

      if (carsResult.error) throw carsResult.error;
      if (bookingsResult.error) throw bookingsResult.error;

      setCars(carsResult.data || []);
      setBookings(bookingsResult.data || []);
    } catch (error) {
      console.error('Error loading host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.start_date) > new Date()
  );

  const activeCars = cars.filter((c) => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {profile?.full_name || 'Host'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Cars</span>
              <CarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeCars}</p>
            <p className="text-xs text-gray-500 mt-1">Currently listed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Upcoming Trips</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Trips</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('cars')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'cars'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Cars
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'earnings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Earnings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'cars' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Vehicles</h2>
                  <a
                    href="/add-car"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Car
                  </a>
                </div>

                {loading ? (
                  <p className="text-center py-12 text-gray-600">Loading...</p>
                ) : cars.length === 0 ? (
                  <div className="text-center py-12">
                    <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't listed any cars yet</p>
                    <a
                      href="/add-car"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      List Your First Car
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cars.map((car) => (
                      <div
                        key={car.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={car.images[0] || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=200'}
                          alt={`${car.year} ${car.make} ${car.model}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ${car.daily_rate}/day • {car.total_trips} trips
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                car.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {car.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bookings</h2>

                {loading ? (
                  <p className="text-center py-12 text-gray-600">Loading...</p>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Booking #{booking.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString()} -{' '}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-700'
                                : booking.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'completed'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {booking.total_days} days • ${booking.total_amount.toFixed(2)}
                          </p>
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-900">
                      ${totalEarnings.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-blue-900">
                      ${Math.floor(totalEarnings * 0.3).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-purple-900">
                      ${Math.floor(totalEarnings * 0.1).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Detailed earnings report coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}