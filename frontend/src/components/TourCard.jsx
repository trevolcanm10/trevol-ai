import React from "react";

export default function TourCard({ tour, onSelect, onCancel, isSelected }) {
  if (!tour) return null;

  // Generate tour destination image based on location
  const getTourImage = (location) => {
    const locationImages = {
      'Lima': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=1000',
      'Cusco': 'https://images.unsplash.com/photo-1526081301029-38041068b52f?q=80&w=1000',
      'Arequipa': 'https://images.unsplash.com/photo-1587466376395-5e43dad360f8?q=80&w=1000',
      'Trujillo': 'https://images.unsplash.com/photo-1600175691579-42a0f389a556?q=80&w=1000',
      'Iquitos': 'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=1000',
      'Puno': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000',
      'Tacna': 'https://images.unsplash.com/photo-1635863133607-d05c74378d1d?q=80&w=1000',
      'Piura': 'https://images.unsplash.com/photo-1601758174501-53c8550136f6?q=80&w=1000'
    };
    return locationImages[location] || `https://source.unsplash.com/featured/400x300/?tour,${location.toLowerCase()}`;
  };

  const tourImage = getTourImage(tour.location);

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
      {/* Tour Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tourImage} 
          alt={`${tour.name} - ${tour.location}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-gray-900">{tour.type}</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{tour.name}</h3>
          <p className="text-sm opacity-90">{tour.location}</p>
        </div>
      </div>

      {/* Tour Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tour</p>
              <p className="text-xs text-gray-400">Ubicación: {tour.location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tipo de tour</p>
            <p className="text-sm font-medium capitalize">{tour.type}</p>
          </div>
        </div>

        {/* Price and Availability */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Precio del tour</span>
            <span className="text-2xl font-bold text-purple-600">S/. {tour.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Disponibilidad</span>
            <span className="text-sm font-semibold text-gray-700">{tour.available_slots} slots</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tipo de experiencia</p>
            <p className="text-lg font-semibold capitalize">{tour.type}</p>
          </div>
          {isSelected ? (
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Quitar Tour</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(tour)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Añadir al viaje</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
