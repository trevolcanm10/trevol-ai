import React from "react"; // importando el hook useState

export default function HotelCard({ hotel, onSelect }) {
  if (!hotel) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">{hotel.name}</h3>
      <p>Ubicación: {hotel.location}</p>
      <p>Precio por noche: ${hotel.price_per_night}</p>
      <p>Habitaciones disponibles: {hotel.available_rooms}</p>

      <button
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        onClick={() => onSelect(hotel)}
      >
        Seleccionar hotel
      </button>
    </div>
  );
}
