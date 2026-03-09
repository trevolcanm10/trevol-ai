import React from "react"; // importando el hook useState
import { createBooking } from "../services/api"; // importando la función createBooking
export default function HotelCard({ hotel }) {
  const handleBook = async () => {
    try {
      await createBooking({
        user_id: 1,
        hotel_id: hotel.id,
      });
      alert("Hotel reservado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al reservar el hotel");
    }
  };
  if (!hotel) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">{hotel.name}</h3>
      <p>Ubicación: {hotel.location}</p>
      <p>Precio por noche: ${hotel.price_per_night}</p>
      <p>Habitaciones disponibles: {hotel.available_rooms}</p>

      <button
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        onClick={handleBook}
      >
        Reservar hotel
      </button>
    </div>
  );
}
