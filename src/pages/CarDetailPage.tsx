import { useState, useEffect } from 'react';
import { Star, Users, Fuel, Settings, Heart, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PLATFORM_FEE_PER_DAY } from '../lib/pricing';
import type { Car, Profile } from '../types/database';

interface CarDetailPageProps {
  carId: string;
}

export function CarDetailPage({ carId }: CarDetailPageProps) {
  const { } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [host, setHost] = useState<Profile | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .maybeSingle();

      if (carError) throw carError;

      if (carData) {
        setCar(carData);

        const { data: hostData, error: hostError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', carData.host_id)
          .maybeSingle();

        if (hostError) throw hostError;
        setHost(hostData);
      }
    } catch (error) {
      console.error('Error loading car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCar: Car = {
    id: carId,
    host_id: '1',
    make: 'مرسيدس بنز',
    model: 'EQS',
    year: 2024,
    trim: 'AMG EQS',
    color: 'أخضر',
    license_plate: null,
    vin: null,
    transmission: 'automatic',
    fuel_type: 'electric',
    seats: 5,
    doors: 4,
    category: 'luxury',
    description: 'اختبر قمة الفخامة الكهربائية مع مرسيدس بنز AMG EQS. تجمع هذه السيارة الرائعة بين التكنولوجيا المتطورة والراحة التي لا مثيل لها.',
    features: ['بلوتوث', 'مدخل USB', 'كاميرا خلفية', 'دخول بدون مفتاح', 'تحكم بالمناخ', 'نظام صوتي فاخر'],
    odometer: 2000,
    daily_rate: 342,
    location_address: null,
    location_city: 'رام الله',
    location_state: 'الضفة الغربية',
    location_zip: null,
    location_country: 'فلسطين',
    latitude: null,
    longitude: null,
    is_available: true,
    is_delivered: true,
    delivery_fee: 50,
    delivery_radius: 25,
    min_trip_duration: 1,
    rating: 4.89,
    total_trips: 22,
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockHost: Profile = {
    id: '1',
    full_name: 'عايدة',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    phone: null,
    date_of_birth: null,
    bio: 'مضيفة ذات خبرة توفر سيارات عالية الجودة',
    address: null,
    city: 'رام الله',
    state: 'الضفة الغربية',
    zip_code: null,
    country: 'فلسطين',
    role: 'host',
    is_verified: true,
    joined_date: '2025-04-01',
    total_trips: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const displayCar = car || mockCar;
  const displayHost = host || mockHost;

  const calculateTotal = () => {
    if (!startDate || !endDate) {
      return {
        days: 0,
        subtotal: 0,
        platformFee: 0,
        total: 0,
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

    const subtotal = displayCar.daily_rate * days;
    const platformFee = PLATFORM_FEE_PER_DAY * days;

    return {
      days,
      subtotal,
      platformFee,
      total: subtotal + platformFee,
    };
  };

  const pricing = calculateTotal();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayCar.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayCar.images.length) % displayCar.images.length);
  };

  const fuelTypeLabels: Record<string, string> = {
    gasoline: 'بنزين',
    diesel: 'ديزل',
    electric: 'كهرباء',
    hybrid: 'هجين',
    'plugin-hybrid': 'هجين قابل للشحن'
  };

  const transmissionLabels: Record<string, string> = {
    automatic: 'أوتوماتيك',
    manual: 'مانيوال'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-xl">
              <img
                src={displayCar.images[currentImageIndex] || displayCar.images[0]}
                alt={`${displayCar.year} ${displayCar.make} ${displayCar.model}`}
                className="w-full h-full object-cover"
              />

              {displayCar.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <button className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110">
                <Heart className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                عرض {displayCar.images.length} صورة
              </div>
            </div>

            {displayCar.images.length > 1 && (
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {displayCar.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all ${
                      currentImageIndex === index ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {displayCar.make} {displayCar.model} {displayCar.year}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-lg">{displayCar.rating.toFixed(2)}</span>
                  <span className="text-gray-600">({displayCar.total_trips} رحلة)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{displayCar.location_city}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {displayHost.full_name?.[0] || 'M'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{displayHost.full_name}</p>
                    <p className="text-sm text-gray-600">المؤجر</p>
                  </div>
                </div>
                <div className="mr-auto flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{displayHost.total_trips}</p>
                    <p className="text-sm text-gray-600">رحلة</p>
                  </div>
                  {displayHost.is_verified && (
                    <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                      موثق
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">المواصفات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Users className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="text-sm text-gray-600">المقاعد</p>
                  <p className="text-xl font-bold text-gray-900">{displayCar.seats}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Fuel className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="text-sm text-gray-600">نوع الوقود</p>
                  <p className="text-xl font-bold text-gray-900">{fuelTypeLabels[displayCar.fuel_type]}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Settings className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="text-sm text-gray-600">ناقل الحركة</p>
                  <p className="text-xl font-bold text-gray-900">{transmissionLabels[displayCar.transmission]}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <MapPin className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="text-sm text-gray-600">التوصيل</p>
                  <p className="text-xl font-bold text-gray-900">{displayCar.is_delivered ? 'متاح' : 'غير متاح'}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الوصف</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {displayCar.description || 'لا يوجد وصف متاح'}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الميزات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {displayCar.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">موقع الاستلام والإرجاع</h2>
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                <MapPin className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">
                    {displayCar.location_city}
                  </p>
                  <p className="text-gray-600">
                    {displayCar.location_address && `${displayCar.location_address}, `}
                    {displayCar.location_state}
                  </p>
                  {displayCar.is_delivered && (
                    <p className="mt-2 text-sm text-emerald-700 font-medium">
                      خدمة التوصيل متاحة ضمن نطاق {displayCar.delivery_radius} كم برسوم ₪{displayCar.delivery_fee}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₪{displayCar.daily_rate + PLATFORM_FEE_PER_DAY}
                  </span>
                  <span className="text-gray-600">/ يوم</span>
                </div>
                <p className="text-sm text-gray-500">يشمل رسوم المنصة</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">رحلتك</h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    تاريخ البداية
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    تاريخ النهاية
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    موقع الاستلام والإرجاع
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900 font-medium">
                      {displayCar.location_city}، {displayCar.location_state}
                    </p>
                  </div>
                </div>
              </div>

              {pricing.days > 0 && (
                <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        ₪{displayCar.daily_rate} × {pricing.days} {pricing.days === 1 ? 'يوم' : 'أيام'}
                      </span>
                      <span className="text-gray-900 font-semibold">₪{pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">رسوم المنصة (₪{PLATFORM_FEE_PER_DAY}/يوم)</span>
                      <span className="text-gray-900 font-semibold">₪{pricing.platformFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {pricing.days > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-lg">المجموع</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      ₪{pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                disabled={!startDate || !endDate}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {!startDate || !endDate ? 'اختر التواريخ' : 'متابعة الحجز'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
