import { createBooking } from "../services/api"; // importando las funciones de la api
import React from "react"; // importando el hook useState
import FlightCard from "./FlightCard"; // importando el componente FlightCard
import HotelCard from "./HotelCard"; // importando el componente HotelCard
import TourCard from "./TourCard"; // importando el componente TourCard
import { useNavigate } from "react-router-dom"; // importando useNavigate
import { useAuth } from "../services/authService"; // importando el hook useAuth

export default function PackageCard({
  packageData,
  onSelectFlight,
  onSelectHotel,
  onSelectTour,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!packageData) return null;

  const handleBookPackage = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva");
      navigate("/login");
      return;
    }

    try {
      await createBooking({
        flight_id: packageData.flight.id,
        hotel_id: packageData.hotel.id,
        tour_id: packageData.tour.id,
      });

      alert("Paquete reservado correctamente");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al crear la reserva:", error);

      const errorMessage =
        error.response?.data?.detail || "Error al crear la reserva";

      alert(errorMessage);
    }
  };

  return (
    <div className="border-2 border-green-500 rounded p-4 shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Paquete recomendado</h2>

      <FlightCard
        flight={packageData.flight}
        onSelect={onSelectFlight}
        onBook={() => {
          if (!user) {
            alert("Debes iniciar sesión para realizar una reserva");
            navigate("/login");
          } else {
            handleBookPackage();
          }
        }}
        user={user}
      />

      <HotelCard
        hotel={packageData.hotel}
        onSelect={onSelectHotel}
        onBook={() => {
          if (!user) {
            alert("Debes iniciar sesión para realizar una reserva");
            navigate("/login");
          } else {
            handleBookPackage();
          }
        }}
        user={user}
      />

      <TourCard
        tour={packageData.tour}
        onSelect={onSelectTour}
        onBook={() => {
          if (!user) {
            alert("Debes iniciar sesión para realizar una reserva");
            navigate("/login");
          } else {
            handleBookPackage();
          }
        }}
        user={user}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="font-bold text-lg">
          Precio total: S/. {packageData.total_price}
        </p>
        <button
          onClick={handleBookPackage}
          disabled={!user}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            user
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {user ? "Reservar Paquete" : "Iniciar Sesión para Reservar"}
        </button>
      </div>
    </div>
  );
}
