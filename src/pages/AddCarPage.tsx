import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Car, Upload, Check, AlertCircle } from 'lucide-react';

const CAR_MAKES = [
  'تويوتا', 'هيونداي', 'كيا', 'نيسان', 'مازدا', 'شيفروليه', 'فورد',
  'هوندا', 'ميتسوبيشي', 'سوزوكي', 'بي ام دبليو', 'مرسيدس بنز',
  'أودي', 'فولكس فاجن', 'سكودا', 'بيجو', 'رينو', 'سيات', 'أخرى'
];

const CAR_MODELS_BY_MAKE: Record<string, string[]> = {
  'تويوتا': ['كامري', 'كورولا', 'يارس', 'راف فور', 'هايلكس', 'لاند كروزر', 'برادو', 'أفانزا', 'فورتشنر', 'سيينا', 'هايس', 'كوستر', 'إيكوا', 'C-HR', 'فينزا'],
  'هيونداي': ['توسان', 'سوناتا', 'النترا', 'أكسنت', 'سنتافي', 'كريتا', 'كونا', 'آيونيك', 'باليسايد', 'فيلوستر', 'جينيسيس', 'فيرنا', 'جراند ستاريكس', 'H1'],
  'كيا': ['سبورتاج', 'سيراتو', 'ريو', 'سورينتو', 'كارنيفال', 'بيكانتو', 'سيلتوس', 'كادينزا', 'ستينجر', 'نيرو', 'سول', 'تيلورايد', 'أوبتيما', 'K5'],
  'نيسان': ['صني', 'ألتيما', 'ماكسيما', 'اكس تريل', 'باترول', 'قشقاي', 'كيكس', 'باثفايندر', 'أرمادا', 'موران', 'جوك', 'ليف', 'سينترا', 'تيدا', 'ميكرا'],
  'مازدا': ['CX-5', 'CX-9', 'مازدا 3', 'مازدا 6', 'CX-3', 'CX-30', 'MX-5', 'مازدا 2', 'CX-8'],
  'شيفروليه': ['كروز', 'ماليبو', 'تاهو', 'سوبربان', 'إكوينوكس', 'تريل بليزر', 'كامارو', 'كورفيت', 'سيلفرادو', 'كولورادو', 'بليزر', 'ترافيرس', 'اكسبريس'],
  'فورد': ['فيوجن', 'اكسبلورر', 'ايدج', 'اف-150', 'ايكو سبورت', 'اكسبديشن', 'موستنج', 'برونكو', 'رينجر', 'ايسكيب', 'فوكس', 'فييستا', 'تورس'],
  'هوندا': ['سيفيك', 'أكورد', 'CR-V', 'HR-V', 'سيتي', 'بايلوت', 'أوديسي', 'ريدج لاين', 'باسبورت', 'انسايت', 'كلاريتي', 'فيت'],
  'ميتسوبيشي': ['لانسر', 'أوتلاندر', 'اكليبس كروس', 'باجيرو', 'أتراج', 'اكسباندر', 'ميراج', 'L200', 'ASX', 'مونتيرو سبورت'],
  'سوزوكي': ['سويفت', 'سيليريو', 'فيتارا', 'بالينو', 'ديزاير', 'إرتيجا', 'جيمني', 'اس كروس', 'سياز', 'XL7'],
  'بي ام دبليو': ['الفئة الثالثة', 'الفئة الخامسة', 'الفئة السابعة', 'X1', 'X3', 'X5', 'X6', 'X7', 'الفئة الرابعة', 'الفئة السادسة', 'الفئة الثامنة', 'Z4', 'i3', 'i8', 'iX'],
  'مرسيدس بنز': ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'CLA', 'CLS', 'SL', 'AMG GT', 'EQS', 'EQC'],
  'أودي': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron'],
  'فولكس فاجن': ['جولف', 'باسات', 'جيتا', 'بولو', 'تيجوان', 'توران', 'آرتيون', 'تي-روك', 'ID.3', 'ID.4', 'شيروكو'],
  'سكودا': ['أوكتافيا', 'سوبيرب', 'رابيد', 'فابيا', 'كودياك', 'كاروك', 'كامق', 'سكالا', 'إنياك'],
  'بيجو': ['208', '301', '308', '408', '508', '2008', '3008', '5008', 'ريفتر', 'تريفيلر'],
  'رينو': ['كليو', 'ميجان', 'تاليسمان', 'كابتشر', 'كوليوس', 'كادجار', 'داستر', 'لوجان', 'سانديرو', 'كانجو'],
  'سيات': ['ليون', 'ابيزا', 'أتيكا', 'أرونا', 'تاراكو', 'الهامبرا', 'ميي'],
  'أخرى': ['أخرى']
};

const YEARS = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);

const CATEGORIES = [
  { value: 'sedan', label: 'سيدان' },
  { value: 'suv', label: 'SUV' },
  { value: 'truck', label: 'بيك أب' },
  { value: 'van', label: 'فان' },
  { value: 'minivan', label: 'ميني فان' },
  { value: 'luxury', label: 'فاخرة' },
  { value: 'sport', label: 'رياضية' },
  { value: 'convertible', label: 'قابلة للطي' },
  { value: 'electric', label: 'كهربائية' },
];

const TRANSMISSION_TYPES = [
  { value: 'automatic', label: 'أوتوماتيك' },
  { value: 'manual', label: 'مانيوال' },
];

const FUEL_TYPES = [
  { value: 'gasoline', label: 'بنزين' },
  { value: 'diesel', label: 'ديزل' },
  { value: 'electric', label: 'كهرباء' },
  { value: 'hybrid', label: 'هجين' },
  { value: 'plugin-hybrid', label: 'هجين قابل للشحن' },
];

const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'ممتازة' },
  { value: 'very-good', label: 'جيدة جداً' },
  { value: 'good', label: 'جيدة' },
  { value: 'fair', label: 'متوسطة' },
];

const FEATURES = [
  'مكيف هواء', 'نظام ملاحة GPS', 'بلوتوث', 'كاميرا خلفية', 'حساسات ركن',
  'فتحة سقف', 'مقاعد جلد', 'نظام صوتي متطور', 'شاشة لمس', 'كروز كنترول',
  'تحكم صوتي', 'تدفئة مقاعد', 'دفع رباعي', 'وسائد هوائية', 'ABS',
  'مدخل USB', 'Apple CarPlay', 'Android Auto', 'إضاءة LED', 'مرايا كهربائية'
];

export function AddCarPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    transmission: 'automatic',
    fuel_type: 'gasoline',
    seats: 5,
    doors: 4,
    category: 'sedan',
    odometer: 0,
    condition: 'excellent',
    vin: '',
    license_plate: '',
    description: '',
    features: [] as string[],
    daily_rate: 0,
    location_city: '',
    location_address: '',
    is_delivered: false,
    delivery_fee: 0,
    delivery_radius: 0,
    min_trip_duration: 1,
    mobile_number: '',
    driver_license: '',
    seatbelts: 5,
    additional_info: '',
    images: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const { data, error: insertError } = await supabase
        .from('cars')
        .insert([{
          host_id: user.id,
          make: formData.make,
          model: formData.model,
          year: formData.year,
          color: formData.color,
          transmission: formData.transmission,
          fuel_type: formData.fuel_type,
          seats: formData.seats,
          doors: formData.doors,
          category: formData.category,
          odometer: formData.odometer,
          vin: formData.vin || null,
          license_plate: formData.license_plate || null,
          description: formData.description,
          features: formData.features,
          daily_rate: formData.daily_rate,
          location_city: formData.location_city,
          location_address: formData.location_address,
          location_country: 'فلسطين',
          is_delivered: formData.is_delivered,
          delivery_fee: formData.delivery_fee,
          delivery_radius: formData.delivery_radius,
          min_trip_duration: formData.min_trip_duration,
          images: formData.images.length > 0 ? formData.images : ['https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'],
          status: 'active',
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/host-dashboard';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إضافة السيارة');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات السيارة الأساسية</h2>
              <p className="text-gray-600">أدخل تفاصيل سيارتك الأساسية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ماركة السيارة <span className="text-red-500">*</span>
                </label>
                <select
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">اختر الماركة</option>
                  {CAR_MAKES.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  موديل السيارة <span className="text-red-500">*</span>
                </label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.make}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">اختر الموديل</option>
                  {formData.make && CAR_MODELS_BY_MAKE[formData.make]?.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  سنة الصنع <span className="text-red-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  لون السيارة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="أبيض، أسود، فضي، إلخ"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  قراءة العداد (كم) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">المواصفات التقنية</h2>
              <p className="text-gray-600">حدد المواصفات الفنية للسيارة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ناقل الحركة <span className="text-red-500">*</span>
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {TRANSMISSION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع الوقود <span className="text-red-500">*</span>
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {FUEL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عدد المقاعد <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  required
                  min="2"
                  max="9"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عدد الأبواب <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="doors"
                  value={formData.doors}
                  onChange={handleInputChange}
                  required
                  min="2"
                  max="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عدد أحزمة الأمان <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="seatbelts"
                  value={formData.seatbelts}
                  onChange={handleInputChange}
                  required
                  min="2"
                  max="9"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  حالة السيارة <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {CONDITION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الشاسيه (VIN)
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="اختياري"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم اللوحة
                </label>
                <input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="اختياري"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                الميزات والإضافات
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {FEATURES.map(feature => (
                  <label
                    key={feature}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.features.includes(feature)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات الموقع والتسعير</h2>
              <p className="text-gray-600">حدد موقع السيارة وسعر الإيجار</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المدينة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location_city"
                  value={formData.location_city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="رام الله، نابلس، الخليل، إلخ"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="الشارع، الحي، رقم المبنى (اختياري)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  السعر اليومي (شيكل) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={formData.daily_rate}
                  onChange={handleInputChange}
                  required
                  min="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="200"
                />
                <p className="text-xs text-gray-500 mt-1">السعر الذي ستحصل عليه بعد خصم رسوم المنصة</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الحد الأدنى لمدة الإيجار (أيام) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="min_trip_duration"
                  value={formData.min_trip_duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="is_delivered"
                    checked={formData.is_delivered}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <label className="font-semibold text-gray-900 cursor-pointer">
                      تقديم خدمة التوصيل
                    </label>
                    <p className="text-sm text-gray-600">يمكنك توصيل السيارة للمستأجر</p>
                  </div>
                </div>
              </div>

              {formData.is_delivered && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رسوم التوصيل (شيكل)
                    </label>
                    <input
                      type="number"
                      name="delivery_fee"
                      value={formData.delivery_fee}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نطاق التوصيل (كم)
                    </label>
                    <input
                      type="number"
                      name="delivery_radius"
                      value={formData.delivery_radius}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات إضافية</h2>
              <p className="text-gray-600">أضف وصفاً تفصيلياً ومعلومات الاتصال</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف المحمول <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="0599123456"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم رخصة القيادة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="driver_license"
                  value={formData.driver_license}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="رقم الرخصة"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  وصف السيارة
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="اكتب وصفاً تفصيلياً عن سيارتك، حالتها، والميزات الخاصة..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  معلومات إضافية
                </label>
                <textarea
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="أي معلومات أخرى تود إضافتها للمستأجرين..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">ملاحظة هامة</p>
                    <p>تأكد من دقة جميع المعلومات المدخلة. سيتم مراجعة البيانات قبل نشر السيارة على المنصة.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لإضافة سيارة</p>
          <a
            href="/login"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إضافة السيارة بنجاح!</h2>
          <p className="text-gray-600 mb-6">سيتم تحويلك إلى لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/host-dashboard" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-4 inline-block">
            ← العودة إلى لوحة التحكم
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">أضف سيارتك للإيجار</h1>
          <p className="text-gray-600">املأ النموذج التالي لإضافة سيارتك إلى المنصة</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s === step
                      ? 'bg-emerald-600 text-white scale-110'
                      : s < step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">معلومات أساسية</span>
            <span className="text-xs text-gray-600">المواصفات</span>
            <span className="text-xs text-gray-600">الموقع والسعر</span>
            <span className="text-xs text-gray-600">معلومات إضافية</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {renderStep()}

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  السابق
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      إضافة السيارة
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
