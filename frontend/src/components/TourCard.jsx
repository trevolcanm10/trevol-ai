import React from "react";

export default function TourCard({ tour, onBook, user }) {
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
        <button
          onClick={onBook}
          disabled={!user}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            user 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {user ? 'Reservar Tour' : 'Iniciar Sesión para Reservar'}
        </button>
      </div>
    </div>
  );
}
