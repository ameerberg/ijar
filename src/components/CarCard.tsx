import { Star } from 'lucide-react';
import { Car } from '../types/database';
import { useState } from 'react';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const mainImage = car.images[0] || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div className="block">
      <a href={`/cars/${car.id}`} className="block group">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={mainImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        <div>
          <h3 className="font-bold text-gray-900 text-base mb-1">
            {car.make} {car.model} {car.year}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {car.rating ? (
              <>
                <span className="font-semibold text-sm text-gray-900">{car.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                <span className="text-sm text-gray-600">({car.total_trips} {car.total_trips === 1 ? 'رحلة' : 'رحلة'})</span>
              </>
            ) : (
              <span className="text-sm text-gray-600">إعلان جديد</span>
            )}
          </div>
        </div>
      </a>

      <a
        href={`/cars/${car.id}`}
        className="text-sm font-semibold text-gray-900 hover:underline inline-block"
      >
        عرض التفاصيل
      </a>
    </div>
  );
}
