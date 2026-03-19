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
    <div className="border-4 border-lams-orange rounded-3xl p-8 shadow-2xl mb-8 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-lams-orange text-white px-6 py-2 rounded-bl-3xl font-bold text-sm tracking-widest uppercase">
        Exclusivo LAMS
      </div>
      <h2 className="text-3xl font-extrabold mb-6 text-lams-navy flex items-center">
        <span className="bg-lams-orange text-white p-2 rounded-lg mr-4">
          <i className="fa-solid fa-star"></i>
        </span>
        Tu Experiencia Lams
      </h2>

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

      <div className="flex flex-col md:flex-row justify-between items-center mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Precio Total del Paquete</p>
          <p className="font-extrabold text-4xl text-lams-navy">
            S/. {packageData.total_price}
          </p>
        </div>
        <div className="flex flex-col space-y-3 w-full md:w-auto">
          <button
            onClick={handleBookPackage}
            disabled={!user}
            className={`w-full md:px-10 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl ${
              user
                ? "bg-lams-orange hover:bg-lams-orange/90 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {user ? "Reservar Ahora" : "Inicia sesión para Reservar"}
          </button>
          
          <a 
            href={`https://wa.me/51999999999?text=Hola Lams Viajes! Me interesa este paquete exclusivo: Vuelo a ${packageData.flight.destination}, Hotel ${packageData.hotel.name} y Tour ${packageData.tour.name}. Precio total: S/. ${packageData.total_price}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-center font-bold flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-lg"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            <span className="text-lg">Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
