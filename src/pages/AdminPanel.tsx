import { useState, useEffect } from 'react';
import { Users, Car as CarIcon, Calendar, DollarSign, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Car, Profile, Booking } from '../types/database';

export function AdminPanel() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'cars' | 'bookings' | 'stats'>('stats');
  const [users, setUsers] = useState<Profile[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadAdminData();
    }
  }, [profile]);

  const loadAdminData = async () => {
    try {
      const [usersResult, carsResult, bookingsResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('cars').select('*'),
        supabase.from('bookings').select('*'),
      ]);

      if (usersResult.error) throw usersResult.error;
      if (carsResult.error) throw carsResult.error;
      if (bookingsResult.error) throw bookingsResult.error;

      setUsers(usersResult.data || []);
      setCars(carsResult.data || []);
      setBookings(bookingsResult.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const activeCars = cars.filter((c) => c.status === 'active').length;
  const totalHosts = users.filter((u) => u.role === 'host').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Users</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-xs text-gray-500 mt-1">{totalHosts} hosts</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Cars</span>
              <CarIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeCars}</p>
            <p className="text-xs text-gray-500 mt-1">of {cars.length} total</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Bookings</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">{pendingBookings} pending</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₪{totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'stats'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('cars')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'cars'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Cars
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
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-4">User Growth</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-800">Total Users</span>
                        <span className="font-semibold text-blue-900">{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-800">Hosts</span>
                        <span className="font-semibold text-blue-900">{totalHosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-800">Guests</span>
                        <span className="font-semibold text-blue-900">
                          {users.filter((u) => u.role === 'guest').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-4">Car Listings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-800">Total Cars</span>
                        <span className="font-semibold text-green-900">{cars.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-800">Active</span>
                        <span className="font-semibold text-green-900">{activeCars}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-800">Inactive</span>
                        <span className="font-semibold text-green-900">
                          {cars.filter((c) => c.status === 'inactive').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-4">Booking Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-800">Pending</span>
                        <span className="font-semibold text-purple-900">
                          {bookings.filter((b) => b.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-800">Confirmed</span>
                        <span className="font-semibold text-purple-900">
                          {bookings.filter((b) => b.status === 'confirmed').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-800">Completed</span>
                        <span className="font-semibold text-purple-900">
                          {bookings.filter((b) => b.status === 'completed').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-4">Revenue</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-orange-800">Total</span>
                        <span className="font-semibold text-orange-900">
                          ₪{totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-orange-800">Avg per Booking</span>
                        <span className="font-semibold text-orange-900">
                          ₪{bookings.length ? Math.floor(totalRevenue / bookings.length) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {loading ? (
                  <p className="text-center py-12 text-gray-600">Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">
                            User
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">
                            Role
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">
                            Trips
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">
                            Joined
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 10).map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'}
                                  alt={user.full_name || 'User'}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user.full_name || 'Unknown'}
                                  </p>
                                  <p className="text-sm text-gray-600">{user.city || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm capitalize text-gray-700">{user.role}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-700">{user.total_trips}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-700">
                                {new Date(user.joined_date).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {user.is_verified ? (
                                <span className="flex items-center gap-1 text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                  <XCircle className="w-4 h-4" />
                                  Unverified
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cars' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Car Management</h2>

                {loading ? (
                  <p className="text-center py-12 text-gray-600">Loading...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars.slice(0, 10).map((car) => (
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
                            ₪{car.daily_rate}/يوم • {car.total_trips} رحلة
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                car.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : car.status === 'inactive'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {car.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Management</h2>

                {loading ? (
                  <p className="text-center py-12 text-gray-600">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 10).map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Booking #{booking.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString()} -{' '}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              ₪{booking.total_amount.toFixed(2)} • {booking.total_days} أيام
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : booking.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                booking.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.payment_status === 'refunded'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {booking.payment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}