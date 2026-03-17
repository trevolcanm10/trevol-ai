import React from "react";

export default function HotelCard({ hotel, onSelect, onCancel, isSelected }) {
  if (!hotel) return null;

  // Generate hotel destination image based on location
  const getHotelImage = (location) => {
    const locationImages = {
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000',
      'Manhattan': 'https://images.unsplash.com/photo-1505765050503-5ef84c10c727?q=80&w=1000',
      'Times Square': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab?q=80&w=1000',
      'Central Park': 'https://images.unsplash.com/photo-1564507592339-915014929332?q=80&w=1000'
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
              <i className="fa-solid fa-hotel text-green-600 text-xl"></i>
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
              <i className="fa-solid fa-times"></i>
              <span>Quitar Hotel</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(hotel)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Añadir al viaje</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
