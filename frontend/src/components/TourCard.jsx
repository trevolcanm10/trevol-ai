import React from "react"; // importando el hook useState
import { createBooking } from "../services/api"; // importando la función createBooking
export default function TourCard({ tour }) {
  const handleBook = async () => {
    try {
      await createBooking({
        user_id: 1,
        tour_id: tour.id,
      });
      alert("Tour reservado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al reservar el tour");
    }
  };
  if (!tour) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">{tour.name}</h3>
      <p>Ubicación: {tour.location}</p>
      <p>Precio: ${tour.price}</p>
      <p>Slots disponibles: {tour.available_slots}</p>

      <button
        className="mt-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
        onClick={handleBook}
      >
        Reservar tour
      </button>
    </div>
  );
}
