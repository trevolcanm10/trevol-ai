import React from "react";

export default function HotelCard({ hotel, onSelect, onCancel, isSelected }) {
  if (!hotel) return null;

  // Generate hotel destination image based on location
  const getHotelImage = (location) => {
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
    return locationImages[location] || `https://source.unsplash.com/featured/400x300/?hotel,${location.toLowerCase()}`;
  };

  const hotelImage = getHotelImage(hotel.location);
  const starsArray = Array.from({ length: hotel.stars }, (_, i) => i);

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
      {/* Hotel Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={hotelImage} 
          alt={`${hotel.name} - ${hotel.location}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.17-7.317-3.849-7.318 3.849 1.402-8.17-5.935-5.787 8.2-1.192z"/>
            </svg>
            <span className="text-sm font-semibold text-gray-900">{hotel.stars} Estrellas</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{hotel.name}</h3>
          <p className="text-sm opacity-90">{hotel.location}</p>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hotel</p>
              <p className="text-xs text-gray-400">Ubicación: {hotel.location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Disponibilidad</p>
            <p className="text-sm font-medium">{hotel.available_rooms} habitaciones</p>
          </div>
        </div>

        {/* Price and Features */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Precio por noche</span>
            <span className="text-2xl font-bold text-green-600">S/. {hotel.price_per_night}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Calificación</span>
            <div className="flex space-x-1">
              {starsArray.map((_, index) => (
                <svg key={index} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.17-7.317-3.849-7.318 3.849 1.402-8.17-5.935-5.787 8.2-1.192z"/>
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Habitaciones disponibles</p>
            <p className="text-lg font-semibold">{hotel.available_rooms}</p>
          </div>
          {isSelected ? (
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Quitar Hotel</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(hotel)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
