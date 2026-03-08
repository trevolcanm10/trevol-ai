import React from "react";

export default function FlightCard({ flight }) {
  if (!flight) return null;
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-2">
      <h3 className="font-bold">
        {flight.origin} → {flight.destination}
      </h3>
      <p>Precio: ${flight.price}</p>
      <p>Asientos disponibles: {flight.available_seats}</p>
    </div>
  );
}