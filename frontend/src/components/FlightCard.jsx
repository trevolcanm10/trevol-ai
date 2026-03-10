import React from "react";// importando el hook useState
export default function FlightCard({ flight ,onSelect}) {// Definimos el componente FlightCard
  if (!flight) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">
        {flight.origin} → {flight.destination}
      </h3>
      <p>Precio: ${flight.price}</p>
      <p>Asientos disponibles: {flight.available_seats}</p>

      <button
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        onClick={() => onSelect(flight)}
      >
        Seleccionar vuelo
      </button>
    </div>
  );
}