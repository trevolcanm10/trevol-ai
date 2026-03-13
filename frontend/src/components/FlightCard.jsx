import React from "react";

export default function FlightCard({ flight, onSelect, isSelected }) {
  if (!flight) return null;

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold text-lg">
        {flight.origin} → {flight.destination}
      </h3>
      <p className="text-gray-600 text-sm">Fecha: {flight.date}</p>
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="font-semibold text-blue-600">S/. {flight.price}</p>
          <p className="text-sm text-gray-500">Asientos: {flight.available_seats}</p>
        </div>
        <button
          onClick={() => onSelect(flight)}
          disabled={isSelected}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-200 text-blue-800 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSelected ? 'Seleccionado' : 'Seleccionar Vuelo'}
        </button>
      </div>
    </div>
  );
}
