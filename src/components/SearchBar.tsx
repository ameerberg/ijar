import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { WEST_BANK_CITIES } from '../constants/cities';

export function SearchBar() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStartDateDropdown, setShowStartDateDropdown] = useState(false);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndDateDropdown, setShowEndDateDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);

  const handleSearch = () => {
    console.log('Search:', { location, startDate, startTime, endDate, endTime });
  };

  const selectCity = (city: string) => {
    setLocation(city);
    setShowCityDropdown(false);
  };

  const timeOptions = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-200">

          {/* Location Field */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => {
                setShowCityDropdown(!showCityDropdown);
                setShowStartDateDropdown(false);
                setShowStartTimeDropdown(false);
                setShowEndDateDropdown(false);
                setShowEndTimeDropdown(false);
              }}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                <div className="flex-1 text-right">
                  <div className="text-xs font-semibold text-gray-500 mb-0.5">أين</div>
                  <div className="text-sm text-gray-900 truncate">
                    {location || 'المدينة'}
                  </div>
                </div>
              </div>
            </button>

            {showCityDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCityDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {WEST_BANK_CITIES.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => selectCity(city)}
                        className="w-full text-right px-3 py-2.5 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-3"
                      >
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Start Date Field */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => {
                setShowStartDateDropdown(!showStartDateDropdown);
                setShowCityDropdown(false);
                setShowStartTimeDropdown(false);
                setShowEndDateDropdown(false);
                setShowEndTimeDropdown(false);
              }}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showStartDateDropdown ? 'rotate-180' : ''}`} />
                <div className="flex-1 text-right">
                  <div className="text-xs font-semibold text-gray-500 mb-0.5">من</div>
                  <div className="text-sm text-gray-900 truncate">
                    {startDate || 'أضف تاريخ'}
                  </div>
                </div>
              </div>
            </button>

            {showStartDateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowStartDateDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setShowStartDateDropdown(false);
                    }}
                    className="w-full text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Start Time Field */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => {
                setShowStartTimeDropdown(!showStartTimeDropdown);
                setShowCityDropdown(false);
                setShowStartDateDropdown(false);
                setShowEndDateDropdown(false);
                setShowEndTimeDropdown(false);
              }}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showStartTimeDropdown ? 'rotate-180' : ''}`} />
                <div className="flex-1 text-right">
                  <div className="text-xs font-semibold text-gray-500 mb-0.5">الوقت</div>
                  <div className="text-sm text-gray-900 truncate">
                    {startTime || 'أضف وقت'}
                  </div>
                </div>
              </div>
            </button>

            {showStartTimeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowStartTimeDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setStartTime(time);
                          setShowStartTimeDropdown(false);
                        }}
                        className="w-full text-center px-3 py-2 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium text-gray-900"
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
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => {
                setShowEndDateDropdown(!showEndDateDropdown);
                setShowCityDropdown(false);
                setShowStartDateDropdown(false);
                setShowStartTimeDropdown(false);
                setShowEndTimeDropdown(false);
              }}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showEndDateDropdown ? 'rotate-180' : ''}`} />
                <div className="flex-1 text-right">
                  <div className="text-xs font-semibold text-gray-500 mb-0.5">حتى</div>
                  <div className="text-sm text-gray-900 truncate">
                    {endDate || 'أضف تاريخ'}
                  </div>
                </div>
              </div>
            </button>

            {showEndDateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEndDateDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setShowEndDateDropdown(false);
                    }}
                    className="w-full text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* End Time Field */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => {
                setShowEndTimeDropdown(!showEndTimeDropdown);
                setShowCityDropdown(false);
                setShowStartDateDropdown(false);
                setShowStartTimeDropdown(false);
                setShowEndDateDropdown(false);
              }}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showEndTimeDropdown ? 'rotate-180' : ''}`} />
                <div className="flex-1 text-right">
                  <div className="text-xs font-semibold text-gray-500 mb-0.5">الوقت</div>
                  <div className="text-sm text-gray-900 truncate">
                    {endTime || 'أضف وقت'}
                  </div>
                </div>
              </div>
            </button>

            {showEndTimeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEndTimeDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setEndTime(time);
                          setShowEndTimeDropdown(false);
                        }}
                        className="w-full text-center px-3 py-2 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium text-gray-900"
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
          <div className="flex items-center justify-center px-2">
            <button
              type="button"
              onClick={handleSearch}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors my-1.5"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
