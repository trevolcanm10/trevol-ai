import React from "react"; // importando el hook useState
import FlightCard from "./FlightCard"; // importando el componente FlightCard
import HotelCard from "./HotelCard"; // importando el componente HotelCard
import TourCard from "./TourCard"; // importando el componente TourCard

export default function PackageCard({ packageData, onSelectFlight, onSelectHotel, onSelectTour }) {
  if (!packageData) return null;
  return (
    <div className="border-2 border-green-500 rounded p-4 shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Paquete recomendado</h2>

      <FlightCard flight={packageData.flight} onSelect={onSelectFlight} />

      <HotelCard hotel={packageData.hotel} onSelect={onSelectHotel} />

      <TourCard tour={packageData.tour} onSelect={onSelectTour} />

      <p className="font-bold mt-2">Precio total: ${packageData.total_price}</p>
    </div>
  );

}