import React from "react"; // importando el hook useState
export default function TourCard({ tour, onSelect }) {

  if (!tour) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">{tour.name}</h3>
      <p>Ubicación: {tour.location}</p>
      <p>Precio: ${tour.price}</p>
      <p>Slots disponibles: {tour.available_slots}</p>

      <button
        className="mt-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
        onClick={() => onSelect(tour)}
      >
        Seleccionar tour
      </button>
    </div>
  );
}
