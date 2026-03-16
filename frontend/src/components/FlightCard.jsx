import React from "react";

export default function FlightCard({ flight, onSelect, isSelected }) {
  if (!flight) return null;

  // Generate travel destination image based on destination
  const getDestinationImage = (destination) => {
    const destinationImages = {
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000'
    };
    return destinationImages[destination] || `https://source.unsplash.com/featured/400x300/?airport,${destination.toLowerCase()}`;
  };

  const destinationImage = getDestinationImage(flight.destination);

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Destination Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={destinationImage} 
          alt={`${flight.destination} vista aérea`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{flight.destination}</h3>
          <p className="text-sm opacity-90">{flight.destination_country}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vuelo</p>
              <p className="text-xs text-gray-400">Origen: {flight.origin}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="text-sm font-medium">{flight.date}</p>
          </div>
        </div>

        {/* Route Information */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Salida</p>
              <p className="font-semibold">{flight.origin}</p>
              <p className="text-xs text-gray-500">{flight.origin_country}</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Destino</p>
              <p className="font-semibold">{flight.destination}</p>
              <p className="text-xs text-gray-500">{flight.destination_country}</p>
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">S/. {flight.price}</p>
            <p className="text-sm text-gray-600">Asientos disponibles: {flight.available_seats}</p>
          </div>
          <button
            onClick={() => onSelect(flight)}
            disabled={isSelected}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              isSelected 
                ? 'bg-blue-100 text-blue-800 cursor-not-allowed shadow-inner' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isSelected ? (
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Seleccionado</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Seleccionar Vuelo</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
