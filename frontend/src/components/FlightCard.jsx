import React from "react";

export default function FlightCard({ flight, onSelect, isSelected }) {
  if (!flight) return null;

  // Generate travel destination image based on destination
  const getDestinationImage = (destination) => {
    const destinationImages = {
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000',
      'Riyadh': 'https://images.unsplash.com/photo-1596500355594-233f8fea62f3?q=80&w=1000',
      'Japon': 'https://images.unsplash.com/photo-1540291882200-37bd04230bf1?q=80&w=1000',
      'China': 'https://images.unsplash.com/photo-1520236060906-9c5ed525b025?q=80&w=1000',
      'Shanghai': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab?q=80&w=1000',
      'Corea del Sur': 'https://images.unsplash.com/photo-1556911220-e37b1d95946f?q=80&w=1000',
      'Brussels': 'https://images.unsplash.com/photo-1549421253-4f6606432f8b?q=80&w=1000',
      'Bahrain': 'https://images.unsplash.com/photo-1551649255-5f885dc03979?q=80&w=1000',
      'Qatar': 'https://images.unsplash.com/photo-1560857792-2ffed0d546d5?q=80&w=1000',
      'Israel': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000',
      'Emiratos Arabes': 'https://images.unsplash.com/photo-1516570101029-46264d0750f5?q=80&w=1000',
      'Reino Unido': 'https://images.unsplash.com/photo-1513635269975-5966b5b32372?q=80&w=1000',
      'EEUU': 'https://images.unsplash.com/photo-1503265831953-9233c4375576?q=80&w=1000',
      'Colombia': 'https://images.unsplash.com/photo-1556911220-e37b1d95946f?q=80&w=1000',
      'Argentina': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000',
      'El Salvador': 'https://images.unsplash.com/photo-1556911220-e37b1d95946f?q=80&w=1000',
      'Brasil': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000',
      'Chile': 'https://images.unsplash.com/photo-1556911220-e37b1d95946f?q=80&w=1000',
      'Mexico': 'https://images.unsplash.com/photo-1503265831953-9233c4375576?q=80&w=1000',
      'Phoenix': 'https://images.unsplash.com/photo-1519750157634-0b1132355068?q=80&w=1000'
    };
    return destinationImages[destination] || `https://source.unsplash.com/featured/400x300/?airport,${destination.toLowerCase()}`;
  };

  const destinationImage = getDestinationImage(flight.destination);

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${isSelected ? 'ring-2 ring-lams-orange' : ''}`}>
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
            <div className="w-12 h-12 bg-lams-orange/10 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-plane text-lams-orange text-xl"></i>
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
              <i className="fa-solid fa-arrow-right text-lams-orange/50 text-2xl"></i>
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
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => onSelect(flight)}
              disabled={isSelected}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                isSelected 
                  ? 'bg-lams-navy/10 text-lams-navy cursor-not-allowed shadow-inner' 
                  : 'bg-lams-navy hover:bg-lams-navy/90 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isSelected ? (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-check text-lams-navy"></i>
                  <span>Seleccionado</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-plus text-white"></i>
                  <span>Seleccionar Vuelo</span>
                </span>
              )}
            </button>
            
            <a 
              href={`https://wa.me/51999999999?text=Hola Lams Viajes! Me interesa el vuelo de ${flight.origin} a ${flight.destination} del día ${flight.date}. S/. ${flight.price}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg text-center font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              <span>Consultar WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
