import React from "react";

export default function HotelCard({ hotel, onSelect, onCancel, isSelected }) {
  if (!hotel) return null;

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold text-lg">{hotel.name}</h3>
      <p className="text-gray-600 text-sm">Ubicación: {hotel.location}</p>
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="font-semibold text-green-600">
            S/. {hotel.price_per_night}/noche
          </p>
          <p className="text-sm text-gray-500">
            Habitaciones: {hotel.available_rooms}
          </p>
          <p className="text-sm text-gray-500">Estrellas: {hotel.stars} ⭐</p>
        </div>
        {isSelected ? (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-medium border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            Quitar Hotel
          </button>
        ) : (
          <button
            onClick={() => onSelect(hotel)}
            className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Añadir al viaje
          </button>
        )}
      </div>
    </div>
  );
}
