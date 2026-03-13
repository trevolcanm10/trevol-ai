import React from "react";

export default function HotelCard({ hotel, onBook, user }) {
  if (!hotel) return null;

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold text-lg">{hotel.name}</h3>
      <p className="text-gray-600 text-sm">Ubicación: {hotel.location}</p>
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="font-semibold text-green-600">S/. {hotel.price_per_night}/noche</p>
          <p className="text-sm text-gray-500">Habitaciones: {hotel.available_rooms}</p>
          <p className="text-sm text-gray-500">Estrellas: {hotel.stars} ⭐</p>
        </div>
        <button
          onClick={onBook}
          disabled={!user}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            user 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {user ? 'Reservar Hotel' : 'Iniciar Sesión para Reservar'}
        </button>
      </div>
    </div>
  );
}
