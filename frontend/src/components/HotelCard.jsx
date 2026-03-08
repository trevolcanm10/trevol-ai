import React from "react";

export default function HotelCard({ hotel }) {
  if (!hotel) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">{hotel.name}</h3>
      <p>Ubicación: {hotel.location}</p>
      <p>Precio por noche: ${hotel.price_per_night}</p>
      <p>Habitaciones disponibles: {hotel.available_rooms}</p>
    </div>
  );
}
