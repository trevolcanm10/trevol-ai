import { jwtDecode } from "jwt-decode"; // importando jwtDecode
import { useState, useEffect } from "react"; // importando el hook useState y useEffect
import { useNavigate } from "react-router-dom"; // importando useNavigate
import { useAuth } from "../services/authService"; // importando el hook useAuth
import { searchTravel, getPackage } from "../services/api"; // importando las funciones de la api
import FlightCard from "../components/FlightCard"; // importando el componente FlightCard
import HotelCard from "../components/HotelCard"; // importando el componente HotelCard
import TourCard from "../components/TourCard"; // importando el componente TourCard
import PackageCard from "../components/PackageCard"; // importando el componente PackageCard
import { createBooking } from "../services/api";
// Definimos el componente Home
export default function Home() {
  const [origin, setOrigin] = useState(""); // Definimos el estado origin
  const [destination, setDestination] = useState(""); // Definimos el estado destination
  const [results, setResults] = useState(null); // Definimos el estado results
  const [packageResult, setPackageResult] = useState(null); // Definimos el estado packageResult
  const [selectedFlight, setSelectedFlight] = useState(null); // Definimos el estado selectedFlight
  const [selectedHotel, setSelectedHotel] = useState(null); // Definimos el estado selectedHotel
  const [selectedTour, setSelectedTour] = useState(null); // Definimos el estado selectedTour
  const [showFlights, setShowFlights] = useState(false); // Definimos el estado showFlights
  const [showHotels, setShowHotels] = useState(false); // Definimos el estado showHotels
  const [showTours, setShowTours] = useState(false); // Definimos el estado showTours
  const [debounceTimer, setDebounceTimer] = useState(null); // Para el debounce del paquete recomendado

  const navigate = useNavigate();
  const { user } = useAuth();

  // Efecto para activación automática del paquete recomendado
  useEffect(() => {
    if (origin.length >= 3 && destination.length >= 3) {
      // Limpiar timer anterior
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Establecer nuevo timer con debounce de 500ms
      const timer = setTimeout(() => {
        handlePackage();
      }, 500);

      setDebounceTimer(timer);
    }
  }, [origin, destination]);

  const handleSearch = async () => {
    // Definimos la función handleSearch
    const response = await searchTravel({
      origin: origin.trim(),
      destination: destination.trim(),
    });
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedTour(null);
    setPackageResult(null); // limpiamos el estado packageResult
    setResults(response.data); // seteamos el estado results con la respuesta de la api
  };

  const handlePackage = async () => {
    // Definimos la función handlePackage
    try {
      const response = await getPackage(origin.trim(), destination.trim());
      setResults(null); // limpiamos el estado results
      setPackageResult(response.data); // seteamos el estado packageResult con la respuesta de la api
    } catch (error) {
      console.error("Error al obtener paquete:", error);
      alert("No se encontró un paquete para ese origen y destino");
    }
  };

  const handleBooking = async () => {
    console.log("USER:", user);
    if (!selectedFlight) {
      alert("Debes seleccionar un vuelo primero");
      return;
    }

    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva");
      navigate("/login");
      return;
    }

    try {
      // Construir el objeto de reserva según el esquema de Pydantic
      const bookingData = {
        user_id: user.id,
        flight_id: selectedFlight.id,
        // Solo incluir campos opcionales si están seleccionados
        ...(selectedHotel && { hotel_id: selectedHotel.id }),
        ...(selectedTour && { tour_id: selectedTour.id }),
      };

      await createBooking(bookingData);

      alert("Reserva creada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    }
  };

  const handleCancelSelection = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedTour(null);
  };

  const handleCancelFlight = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedTour(null);
  };

  const handleCancelHotel = () => {
    setSelectedHotel(null);
  };

  const handleCancelTour = () => {
    setSelectedTour(null);
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setSelectedHotel(null);
    setSelectedTour(null);
    setShowHotels(true);
    setShowTours(true);
  };

  const handleBookFlight = async (flight) => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva");
      navigate("/login");
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        flight_id: flight.id,
      };

      await createBooking(bookingData);
      alert("Vuelo reservado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    }
  };

  const handleBookHotel = async (hotel) => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva");
      navigate("/login");
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        flight_id: selectedFlight?.id,
        hotel_id: hotel.id,
      };

      await createBooking(bookingData);
      alert("Hotel reservado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    }
  };

  const handleBookTour = async (tour) => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva");
      navigate("/login");
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        flight_id: selectedFlight?.id,
        hotel_id: selectedHotel?.id,
        tour_id: tour.id,
      };

      await createBooking(bookingData);
      alert("Tour reservado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Travel-AI</h1>
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Bienvenido, {user.name}
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

      {(selectedFlight || selectedHotel || selectedTour) && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Resumen de mi viaje
            </h2>
            <button
              onClick={handleCancelSelection}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
            >
              Cancelar todo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Vuelo</p>
                  {selectedFlight ? (
                    <p className="text-sm text-gray-600">
                      {selectedFlight.origin} ({selectedFlight.origin_country})
                      → {selectedFlight.destination_city},{" "}
                      {selectedFlight.destination_country}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No seleccionado</p>
                  )}
                </div>
                {selectedFlight && (
                  <button
                    onClick={handleCancelFlight}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Hotel</p>
                  {selectedHotel ? (
                    <p className="text-sm text-gray-600">
                      {selectedHotel.name}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No seleccionado</p>
                  )}
                </div>
                {selectedHotel && (
                  <button
                    onClick={handleCancelHotel}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Tour</p>
                  {selectedTour ? (
                    <p className="text-sm text-gray-600">{selectedTour.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">No seleccionado</p>
                  )}
                </div>
                {selectedTour && (
                  <button
                    onClick={handleCancelTour}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleBooking}
              disabled={!selectedFlight}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg ${
                !selectedFlight
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              }`}
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Origen"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Destino"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
        <button
          onClick={handlePackage}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Ver paquete recomendado
        </button>
      </div>

      {results && (
        <div>
          <h2 className="text-xl font-bold mb-2">Resultados</h2>

          {/* Vuelos */}
          <button
            onClick={() => setShowFlights(!showFlights)}
            className="font-bold mt-2 bg-gray-200 p-2 rounded w-full text-left"
          >
            {showFlights ? "▼ Vuelos" : "▶ Vuelos"} ({results.flights.length}{" "}
            encontrados)
          </button>

          {showFlights &&
            results.flights
              .filter((f) => {
                const originMatch =
                  f.origin.toLowerCase().includes(origin.toLowerCase()) ||
                  f.origin_country.toLowerCase().includes(origin.toLowerCase());
                const destinationMatch =
                  f.destination_city
                    .toLowerCase()
                    .includes(destination.toLowerCase()) ||
                  f.destination_country
                    .toLowerCase()
                    .includes(destination.toLowerCase());
                return originMatch && destinationMatch;
              })
              .map((f) => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  onSelect={handleSelectFlight}
                  onBook={() => handleBookFlight(f)}
                  user={user}
                />
              ))}

          {/* Hoteles */}
          <button
            onClick={() => setShowHotels(!showHotels)}
            className={`font-bold mt-2 p-2 rounded w-full text-left transition-colors ${
              selectedFlight
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedFlight}
          >
            {showHotels ? "▼ Hoteles" : "▶ Hoteles"} ({results.hotels.length}{" "}
            encontrados)
          </button>

          {showHotels &&
            results.hotels
              .filter((h) => {
                if (selectedFlight) {
                  // Escenario B: Con vuelo seleccionado, comparar con destination_city
                  return (
                    h.location.toLowerCase() ===
                    selectedFlight.destination_city?.toLowerCase()
                  );
                } else {
                  // Escenario A: Sin vuelo seleccionado, filtrar por input de destino
                  return h.location
                    .toLowerCase()
                    .includes(destination.toLowerCase());
                }
              })
              .map((h) => (
                <HotelCard
                  key={h.id}
                  hotel={h}
                  onSelect={setSelectedHotel}
                  onBook={() => handleBookHotel(h)}
                  user={user}
                />
              ))}

          {/* Tours */}
          <button
            onClick={() => setShowTours(!showTours)}
            className={`font-bold mt-2 p-2 rounded w-full text-left transition-colors ${
              selectedFlight
                ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedFlight}
          >
            {showTours ? "▼ Tours" : "▶ Tours"} ({results.tours.length}{" "}
            encontrados)
          </button>

          {showTours &&
            results.tours
              .filter((t) => {
                if (selectedFlight) {
                  // Escenario B: Con vuelo seleccionado, comparar con destination_city
                  return (
                    t.location.toLowerCase() ===
                    selectedFlight.destination_city?.toLowerCase()
                  );
                } else {
                  // Escenario A: Sin vuelo seleccionado, filtrar por input de destino
                  return t.location
                    .toLowerCase()
                    .includes(destination.toLowerCase());
                }
              })
              .map((t) => (
                <TourCard
                  key={t.id}
                  tour={t}
                  onSelect={setSelectedTour}
                  onBook={() => handleBookTour(t)}
                  user={user}
                />
              ))}

          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <button
              onClick={handleBooking}
              disabled={!selectedFlight}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg ${
                !selectedFlight
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              }`}
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      )}

      {packageResult && (
        <PackageCard
          packageData={packageResult}
          onSelectFlight={setSelectedFlight}
          onSelectHotel={setSelectedHotel}
          onSelectTour={setSelectedTour}
        />
      )}
    </div>
  );
}
