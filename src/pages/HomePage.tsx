import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { CarCard } from '../components/CarCard';
import { ChevronLeft, ChevronRight, Car as CarIcon, Plane, Calendar, MapPin, Truck, Building2, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Car } from '../types/database';

type FilterType = 'all' | 'airports' | 'monthly' | 'nearby' | 'delivered' | 'cities';

export function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, [selectedCity, activeFilter]);

  const loadCars = async () => {
    try {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'active');

      if (selectedCity) {
        query = query.eq('location_city', selectedCity);
      }

      if (activeFilter === 'delivered') {
        query = query.eq('is_delivered', true);
      } else if (activeFilter === 'monthly') {
        query = query.gte('min_trip_duration', 30);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCars: Car[] = [
    {
      id: '1',
      host_id: '1',
      make: 'تويوتا',
      model: 'كامري',
      year: 2023,
      trim: 'SE',
      color: 'أبيض',
      license_plate: null,
      vin: null,
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      doors: 4,
      category: 'sedan',
      description: 'سيارة عائلية مريحة واقتصادية',
      features: ['أوتوماتيك', 'بنزين', '5 مقاعد', 'بلوتوث'],
      odometer: 15000,
      daily_rate: 200,
      location_address: null,
      location_city: 'رام الله',
      location_state: 'الضفة الغربية',
      location_zip: null,
      location_country: 'فلسطين',
      latitude: null,
      longitude: null,
      is_available: true,
      is_delivered: true,
      delivery_fee: 30,
      delivery_radius: 15,
      min_trip_duration: 1,
      rating: 4.9,
      total_trips: 45,
      images: ['https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      host_id: '1',
      make: 'هيونداي',
      model: 'توسان',
      year: 2022,
      trim: 'Limited',
      color: 'أسود',
      license_plate: null,
      vin: null,
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      doors: 4,
      category: 'suv',
      description: 'سيارة دفع رباعي حديثة ومجهزة بالكامل',
      features: ['أوتوماتيك', 'دفع رباعي', 'كاميرا خلفية', 'سقف بانوراما'],
      odometer: 28000,
      daily_rate: 300,
      location_address: null,
      location_city: 'نابلس',
      location_state: 'الضفة الغربية',
      location_zip: null,
      location_country: 'فلسطين',
      latitude: null,
      longitude: null,
      is_available: true,
      is_delivered: true,
      delivery_fee: 40,
      delivery_radius: 20,
      min_trip_duration: 1,
      rating: 4.95,
      total_trips: 38,
      images: ['https://images.pexels.com/photos/1429775/pexels-photo-1429775.jpeg?auto=compress&cs=tinysrgb&w=800'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      host_id: '1',
      make: 'كيا',
      model: 'سبورتاج',
      year: 2024,
      trim: 'EX',
      color: 'رمادي',
      license_plate: null,
      vin: null,
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      doors: 4,
      category: 'suv',
      description: 'سيارة كروس أوفر حديثة بكفاءة عالية',
      features: ['أوتوماتيك', 'شاشة لمس', 'حساسات', 'كروز كنترول'],
      odometer: 8000,
      daily_rate: 280,
      location_address: null,
      location_city: 'الخليل',
      location_state: 'الضفة الغربية',
      location_zip: null,
      location_country: 'فلسطين',
      latitude: null,
      longitude: null,
      is_available: true,
      is_delivered: true,
      delivery_fee: 35,
      delivery_radius: 18,
      min_trip_duration: 1,
      rating: 4.92,
      total_trips: 52,
      images: ['https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      host_id: '1',
      make: 'مازدا',
      model: 'CX-5',
      year: 2023,
      trim: 'Signature',
      color: 'أحمر',
      license_plate: null,
      vin: null,
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      doors: 4,
      category: 'suv',
      description: 'سيارة SUV رياضية أنيقة',
      features: ['أوتوماتيك', 'جلد', 'نظام صوتي Bose', 'فتحة سقف'],
      odometer: 22000,
      daily_rate: 320,
      location_address: null,
      location_city: 'بيت لحم',
      location_state: 'الضفة الغربية',
      location_zip: null,
      location_country: 'فلسطين',
      latitude: null,
      longitude: null,
      is_available: true,
      is_delivered: true,
      delivery_fee: 35,
      delivery_radius: 20,
      min_trip_duration: 1,
      rating: 5.0,
      total_trips: 32,
      images: ['https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const displayCars = cars.length > 0 ? cars : mockCars;
  const filteredCars = selectedCity
    ? displayCars.filter(car => car.location_city === selectedCity)
    : displayCars;

  const filterButtons = [
    { id: 'all', label: 'الكل', icon: CarIcon },
    { id: 'airports', label: 'المطارات', icon: Plane },
    { id: 'monthly', label: 'شهري', icon: Calendar },
    { id: 'nearby', label: 'قريب', icon: MapPin },
    { id: 'delivered', label: 'توصيل', icon: Truck },
    { id: 'cities', label: 'المدن', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-2">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 to-blue-800/85"></div>

          <div className="relative px-12 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
                تجاوز مكاتب تأجير السيارات
              </h1>
              <p className="text-xl text-white/95 mb-8">
                استأجر أي سيارة تقريباً، في أي مكان تقريباً
              </p>

              <div className="mb-6">
                <SearchBar />
              </div>

              <button className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
                <Play className="w-4 h-4 fill-current" />
                تعرف على المنصة
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 sticky top-0 z-40 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto py-3.5 scrollbar-hide">
            {filterButtons.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                    activeFilter === filter.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري تحميل السيارات...</p>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  إيجار سيارات شهري في رام الله
                  <span className="ml-2 text-2xl">›</span>
                </h2>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                {filteredCars.slice(0, 4).map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  سيارات فاخرة للإيجار في القدس
                  <span className="ml-2 text-2xl">›</span>
                </h2>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors bg-white">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                {filteredCars.slice(0, 4).map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
