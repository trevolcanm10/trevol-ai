import React from "react";

export default function TourCard({ tour, onSelect, onCancel, isSelected }) {
  if (!tour) return null;

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold text-lg">{tour.name}</h3>
      <p className="text-gray-600 text-sm">Ubicación: {tour.location}</p>
      <p className="text-gray-600 text-sm">Tipo: {tour.type}</p>
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="font-semibold text-purple-600">S/. {tour.price}</p>
          <p className="text-sm text-gray-500">Slots disponibles: {tour.available_slots}</p>
        </div>
        {isSelected ? (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-medium border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            Quitar Tour
          </button>
        ) : (
          <button
            onClick={onSelect}
            className="px-4 py-2 rounded-md font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Añadir al viaje
          </button>
        )}
      </div>
    </div>
  );
}
