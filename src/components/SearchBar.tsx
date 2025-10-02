import { Search, MapPin, ChevronDown, Calendar, Clock, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WEST_BANK_CITIES } from '../constants/cities';

type TripType = 'any' | 'airport' | 'long' | 'delivered';

export function SearchBar() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [tripType, setTripType] = useState<TripType>('any');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStartDateDropdown, setShowStartDateDropdown] = useState(false);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndDateDropdown, setShowEndDateDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);

  const handleSearch = () => {
    console.log('Search:', { location, startDate, startTime, endDate, endTime, tripType });
  };

  const selectCity = (city: string) => {
    setLocation(city);
    setShowCityDropdown(false);
  };

  const timeOptions = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  const quickFilters = useMemo(
    () => [
      {
        id: 'any' as TripType,
        label: 'أي رحلة',
        description: 'كل السيارات المتاحة',
      },
      {
        id: 'airport' as TripType,
        label: 'توصيل للمطار',
        description: 'سيارات مخصصة لرحلات المطار',
      },
      {
        id: 'long' as TripType,
        label: 'رحلات طويلة',
        description: 'خصومات للإيجار الشهري',
      },
      {
        id: 'delivered' as TripType,
        label: 'توصيل للمنزل',
        description: 'خدمة التوصيل حتى بابك',
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-2xl">
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl">
          <div className="flex flex-col gap-4 p-5 md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <Sparkles className="h-4 w-4" />
                  <span>رحلة أسهل تبدأ هنا</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">ابحث عن السيارة المثالية لرحلتك</h2>
                <p className="mt-1 text-sm text-gray-500">
                  اختر وجهتك وحدد وقت الرحلة، وسنساعدك في العثور على أفضل سيارة متاحة.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setTripType(filter.id)}
                    className={`group rounded-full border px-4 py-2 text-sm transition-all ${
                      tripType === filter.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-transparent bg-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <span className="block text-right font-semibold">{filter.label}</span>
                    <span className="block text-right text-xs text-gray-500 group-hover:text-current">
                      {filter.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))_auto]">
                {/* Location Field */}
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={showCityDropdown}
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown);
                      setShowStartDateDropdown(false);
                      setShowStartTimeDropdown(false);
                      setShowEndDateDropdown(false);
                      setShowEndTimeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-right shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">الوجهة</span>
                      <span className="flex items-center justify-end gap-2 text-sm font-medium text-gray-900">
                        {location || 'اختر المدينة'}
                        <MapPin className="h-4 w-4 text-blue-500" />
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showCityDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 origin-top rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-xl ring-1 ring-black/5">
                        <div className="max-h-80 overflow-y-auto">
                          {WEST_BANK_CITIES.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => selectCity(city)}
                              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-right transition-colors hover:bg-blue-50"
                            >
                              <span className="text-sm font-medium text-gray-900">{city}</span>
                              <MapPin className="h-4 w-4 text-blue-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Start Date Field */}
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={showStartDateDropdown}
                    onClick={() => {
                      setShowStartDateDropdown(!showStartDateDropdown);
                      setShowCityDropdown(false);
                      setShowStartTimeDropdown(false);
                      setShowEndDateDropdown(false);
                      setShowEndTimeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-right shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">من</span>
                      <span className="flex items-center justify-end gap-2 text-sm font-medium text-gray-900">
                        {startDate || 'أضف تاريخ البداية'}
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${showStartDateDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showStartDateDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowStartDateDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 origin-top rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl ring-1 ring-black/5">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setShowStartDateDropdown(false);
                          }}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Start Time Field */}
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={showStartTimeDropdown}
                    onClick={() => {
                      setShowStartTimeDropdown(!showStartTimeDropdown);
                      setShowCityDropdown(false);
                      setShowStartDateDropdown(false);
                      setShowEndDateDropdown(false);
                      setShowEndTimeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-right shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">وقت البداية</span>
                      <span className="flex items-center justify-end gap-2 text-sm font-medium text-gray-900">
                        {startTime || 'اختر الوقت'}
                        <Clock className="h-4 w-4 text-blue-500" />
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${showStartTimeDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showStartTimeDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowStartTimeDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 origin-top rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-xl ring-1 ring-black/5">
                        <div className="max-h-64 overflow-y-auto">
                          {timeOptions.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setStartTime(time);
                                setShowStartTimeDropdown(false);
                              }}
                              className="w-full rounded-xl px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* End Date Field */}
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={showEndDateDropdown}
                    onClick={() => {
                      setShowEndDateDropdown(!showEndDateDropdown);
                      setShowCityDropdown(false);
                      setShowStartDateDropdown(false);
                      setShowStartTimeDropdown(false);
                      setShowEndTimeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-right shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">حتى</span>
                      <span className="flex items-center justify-end gap-2 text-sm font-medium text-gray-900">
                        {endDate || 'أضف تاريخ العودة'}
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${showEndDateDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showEndDateDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowEndDateDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 origin-top rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl ring-1 ring-black/5">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setShowEndDateDropdown(false);
                          }}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* End Time Field */}
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={showEndTimeDropdown}
                    onClick={() => {
                      setShowEndTimeDropdown(!showEndTimeDropdown);
                      setShowCityDropdown(false);
                      setShowStartDateDropdown(false);
                      setShowStartTimeDropdown(false);
                      setShowEndDateDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-right shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">وقت العودة</span>
                      <span className="flex items-center justify-end gap-2 text-sm font-medium text-gray-900">
                        {endTime || 'اختر الوقت'}
                        <Clock className="h-4 w-4 text-blue-500" />
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${showEndTimeDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showEndTimeDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowEndTimeDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 origin-top rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-xl ring-1 ring-black/5">
                        <div className="max-h-64 overflow-y-auto">
                          {timeOptions.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setEndTime(time);
                                setShowEndTimeDropdown(false);
                              }}
                              className="w-full rounded-xl px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Search Button */}
                <div className="flex items-center justify-center md:self-stretch">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white md:h-full md:w-auto md:min-w-[160px]"
                  >
                    <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>ابحث الآن</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
