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
  const [searching, setSearching] = useState(false); // Estado para indicar búsqueda en progreso

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
    setSearching(true);
    try {
      const response = await searchTravel({
        origin: origin.trim(),
        destination: destination.trim(),
      });
      setSelectedFlight(null);
      setSelectedHotel(null);
      setSelectedTour(null);
      setPackageResult(null); // limpiamos el estado packageResult
      setResults(response.data); // seteamos el estado results con la respuesta de la api
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Error al realizar la búsqueda. Por favor intente de nuevo.");
    } finally {
      setSearching(false);
    }
  };

  const handlePackage = async () => {
    // Definimos la función handlePackage
    setSearching(true);
    try {
      const response = await getPackage(origin.trim(), destination.trim());
      setResults(null); // limpiamos el estado results
      setPackageResult(response.data); // seteamos el estado packageResult con la respuesta de la api
    } catch (error) {
      console.error("Error al obtener paquete:", error);
      // No mostramos alerta para paquetes no encontrados, solo para errores reales
      if (error.response?.status !== 404) {
        alert("Error al obtener el paquete recomendado");
      }
    } finally {
      setSearching(false);
    }
  };

  const handleBooking = async () => {
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
        flight_id: selectedFlight.id,
        // Solo incluir campos opcionales si están seleccionados
        hotel_id: selectedHotel?.id ?? null,
        tour_id: selectedTour?.id ?? null,
      };
      console.log("BOOKING DATA:", bookingData);
      await createBooking(bookingData);

      alert("Reserva creada correctamente");
      // Limpiar selección después de reserva exitosa
      setSelectedFlight(null);
      setSelectedHotel(null);
      setSelectedTour(null);
    } catch (error) {
      console.error("ERROR BACKEND:", error.response?.data);
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
      // Limpiar selección después de reserva exitosa
      setSelectedFlight(null);
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
      // Limpiar selección después de reserva exitosa
      setSelectedHotel(null);
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
      // Limpiar selección después de reserva exitosa
      setSelectedTour(null);
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-white">✈️</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Travel-AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre tu próximo destino con inteligencia artificial. 
              Encuentra vuelos, hoteles y tours perfectos para tu viaje ideal.
            </p>
            
            {/* User Status Bar */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {user ? (
                  <div className="flex items-center space-x-6">
                    <span className="text-lg font-semibold text-gray-900">
                      👋 Bienvenido, {user.name}
                    </span>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      📊 Ir al Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      🔐 Iniciar Sesión
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      📝 Registrarse
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Summary Card */}
        {(selectedFlight || selectedHotel || selectedTour) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-8 shadow-xl border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🧳 Resumen de tu Viaje
              </h2>
              <button
                onClick={handleCancelSelection}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🗑️ Cancelar Todo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">✈️</span>
                      <p className="font-bold text-gray-900 text-lg">Vuelo</p>
                    </div>
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
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🏨</span>
                      <p className="font-bold text-gray-900 text-lg">Hotel</p>
                    </div>
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
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🗺️</span>
                      <p className="font-bold text-gray-900 text-lg">Tour</p>
                    </div>
                    {selectedTour ? (
                      <p className="text-sm text-gray-600">{selectedTour.name}</p>
                    ) : (
                      <p className="text-sm text-gray-400">No seleccionado</p>
                    )}
                  </div>
                  {selectedTour && (
                    <button
                      onClick={handleCancelTour}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleBooking}
                disabled={!selectedFlight}
                className={`px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  !selectedFlight
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                }`}
              >
                {selectedFlight ? "✅ Confirmar Reserva" : "⚠️ Selecciona un Vuelo"}
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🔍 Encuentra tu Próximo Destino</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
              <input
                type="text"
                placeholder="Ej: Lima, Arequipa, Cusco"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
              <input
                type="text"
                placeholder="Ej: Cusco, Lima, Arequipa"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Acciones</label>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    searching
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {searching ? "🔍 Buscando..." : "🔍 Buscar Vuelos"}
                </button>
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paquete Inteligente</label>
              <button
                onClick={handlePackage}
                disabled={searching || origin.length < 3 || destination.length < 3}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  searching || origin.length < 3 || destination.length < 3
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {searching ? "🤖 Analizando..." : "🤖 Paquete AI"}
              </button>
              {(origin.length < 3 || destination.length < 3) && (
                <p className="text-xs text-gray-500 mt-1">Ingresa al menos 3 caracteres para activar el paquete</p>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {searching && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Buscando destinos perfectos para ti...</p>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">📋 Resultados de Búsqueda</h3>

            {/* Vuelos */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <button
                onClick={() => setShowFlights(!showFlights)}
                className={`w-full text-left font-bold text-lg p-4 rounded-lg transition-all duration-200 ${
                  showFlights 
                    ? "bg-blue-50 text-blue-800 border border-blue-200" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">✈️</span>
                    <span>Vuelos Disponibles</span>
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {results.flights.length} encontrados
                  </span>
                </div>
              </button>

              {showFlights && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                  {results.flights
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
                </div>
              )}
            </div>

            {/* Hoteles */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <button
                onClick={() => setShowHotels(!showHotels)}
                disabled={!selectedFlight}
                className={`w-full text-left font-bold text-lg p-4 rounded-lg transition-all duration-200 ${
                  !selectedFlight
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : showHotels 
                      ? "bg-green-50 text-green-800 border border-green-200" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">🏨</span>
                    <span>Hoteles Disponibles</span>
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {results.hotels.length} encontrados
                  </span>
                </div>
              </button>

              {showHotels && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                  {results.hotels
                    .filter((h) => {
                      if (selectedFlight) {
                        return (
                          h.location.toLowerCase() ===
                          selectedFlight.destination_city?.toLowerCase()
                        );
                      } else {
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
                </div>
              )}
            </div>

            {/* Tours */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <button
                onClick={() => setShowTours(!showTours)}
                disabled={!selectedFlight}
                className={`w-full text-left font-bold text-lg p-4 rounded-lg transition-all duration-200 ${
                  !selectedFlight
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : showTours 
                      ? "bg-purple-50 text-purple-800 border border-purple-200" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">🗺️</span>
                    <span>Tours Disponibles</span>
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {results.tours.length} encontrados
                  </span>
                </div>
              </button>

              {showTours && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                  {results.tours
                    .filter((t) => {
                      if (selectedFlight) {
                        return (
                          t.location.toLowerCase() ===
                          selectedFlight.destination_city?.toLowerCase()
                        );
                      } else {
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
                </div>
              )}
            </div>
          </div>
        )}

        {packageResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">🤖 Paquete Recomendado por IA</h3>
            <PackageCard
              packageData={packageResult}
              onSelectFlight={setSelectedFlight}
              onSelectHotel={setSelectedHotel}
              onSelectTour={setSelectedTour}
            />
          </div>
        )}
      </div>
    </div>
  );
}
