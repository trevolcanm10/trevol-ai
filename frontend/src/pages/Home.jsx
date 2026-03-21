import { useState, useEffect } from "react"; // importando el hook useState y useEffect
import { useNavigate } from "react-router-dom"; // importando useNavigate
import { useAuth } from "../services/authService"; // importando el hook useAuth
import { searchTravel, getPackage } from "../services/api"; // importando las funciones de la api
import FlightCard from "../components/FlightCard"; // importando el componente FlightCard
import HotelCard from "../components/HotelCard"; // importando el componente HotelCard
import TourCard from "../components/TourCard"; // importando el componente TourCard
import ServiceCard from "../components/ServiceCard"; // importando el componente ServiceCard
import PackageCard from "../components/PackageCard"; // importando el componente PackageCard
import { createBooking } from "../services/api";
import FlightManager from "../components/admin/FlightManager";
import HotelManager from "../components/admin/HotelManager";
import TourManager from "../components/admin/TourManager";
// Definimos el componente Home
export default function Home() {
  const [origin, setOrigin] = useState(""); // Definimos el estado origin
  const [destination, setDestination] = useState(""); // Definimos el estado destination
  const [results, setResults] = useState(null); // Definimos el estado results
  const [packageResult, setPackageResult] = useState(null); // Definimos el estado packageResult
  const [selectedFlight, setSelectedFlight] = useState(null); // Definimos el estado selectedFlight
  const [selectedHotel, setSelectedHotel] = useState(null); // Definimos el estado selectedHotel
  const [selectedTour, setSelectedTour] = useState(null); // Definimos el estado selectedTour
  const [selectedServices, setSelectedServices] = useState([]); // Servicios adicionales (seguros, trámites, etc.)
  const [showFlights, setShowFlights] = useState(false); // Definimos el estado showFlights
  const [showHotels, setShowHotels] = useState(false); // Definimos el estado showHotels
  const [showTours, setShowTours] = useState(false); // Definimos el estado showTours
  const [debounceTimer, setDebounceTimer] = useState(null); // Para el debounce del paquete recomendado
  const [searching, setSearching] = useState(false); // Estado para indicar búsqueda en progreso
  const [adminTab, setAdminTab] = useState("flights"); // "flights", "hotels", "tours"

  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
        hotel_id: selectedHotel?.id ?? null,
        tour_id: selectedTour?.id ?? null,
        service_ids: selectedServices.map(s => s.id)
      };
      console.log("BOOKING DATA:", bookingData);
      await createBooking(bookingData);

      alert("Reserva creada correctamente");
      // Limpiar selección después de reserva exitosa
      setSelectedFlight(null);
      setSelectedHotel(null);
      setSelectedTour(null);
      setSelectedServices([]);
    } catch (error) {
      console.error("ERROR BACKEND:", error.response?.data);
      alert("Error al crear la reserva");
    }
  };

  const handleCancelSelection = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedTour(null);
    setSelectedServices([]);
  };

  const handleCancelFlight = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedTour(null);
    setSelectedServices([]);
  };

  const handleCancelHotel = () => {
    setSelectedHotel(null);
  };

  const handleCancelTour = () => {
    setSelectedTour(null);
  };

  const handleCancelService = (serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setSelectedHotel(null);
    setSelectedTour(null);
    setSelectedServices([]);
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
      {/* Hero Section Immersivo */}
      <div className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Fondo de Avión IA Moderno */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000')] bg-cover bg-center"></div>
        {/* Capa Oscura/Malla para el contraste */}
        <div className="absolute inset-0 bg-gray-900/70 bg-gradient-to-b from-gray-900/40 via-gray-900/60 to-[#f8fafc]"></div>
        
        {/* Luces Ambientales AI */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full animate-fade-in">
          <div className="text-center">
            {/* Ícono Neón / Holográfico */}
            <div className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
              <span className="text-4xl text-cyan-400">
                <i className="fa-solid fa-plane-departure"></i>
              </span>
            </div>
            
            {/* Título Principal */}
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
              LAMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-lams-orange to-[#f19b5c]">VIAJES</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
              <span className="block text-lams-orange font-bold text-3xl mb-4 tracking-[0.3em] uppercase">Viaja • Sueña • Imagina</span>
              Encuentra el destino de tus sueños con la mejor atención personalizada.
              Diseñamos el trayecto perfecto para ti en segundos.
            </p>

          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Selection Summary Card */}
        {(selectedFlight || selectedHotel || selectedTour || selectedServices.length > 0) && (() => {
          const getCategoryLabel = (item) => {
            const labels = { seguro: '🛡️ Seguro de Viaje', tramite: '📋 Trámite', traslado: '🚗 Traslado', migratorio: '🌍 Migratorio', grupo_escolar: '👥 Grupo Escolar' };
            return labels[item?.category] || '🗺️ Tour';
          };
          const totalEstimado = (selectedFlight?.price || 0) + (selectedHotel?.price_per_night || 0) + (selectedTour?.price || 0) + selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

          return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-10 rounded-3xl mb-10 shadow-xl border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Resumen de tu Viaje</h2>
                  <p className="text-sm text-gray-500 mt-1">Precio estimado total: <span className="font-bold text-lams-orange text-lg">S/. {totalEstimado.toFixed(2)}</span></p>
                </div>
                <button onClick={handleCancelSelection} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl mt-4 md:mt-0">
                  Cancelar Todo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Vuelo */}
                <div className={`bg-white p-5 rounded-2xl border-2 shadow-lg transition-all ${selectedFlight ? 'border-blue-400' : 'border-dashed border-gray-200 opacity-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">✈️</span>
                    <p className="font-bold text-gray-900">Vuelo</p>
                  </div>
                  {selectedFlight ? (
                    <>
                      <p className="text-xs text-gray-600 mb-1">{selectedFlight.origin} → {selectedFlight.destination_city}</p>
                      <p className="text-lams-orange font-bold text-sm">S/. {selectedFlight.price}</p>
                      <button onClick={handleCancelFlight} className="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold underline">Quitar</button>
                    </>
                  ) : <p className="text-xs text-gray-400 italic">No seleccionado</p>}
                </div>

                {/* Hotel */}
                <div className={`bg-white p-5 rounded-2xl border-2 shadow-lg transition-all ${selectedHotel ? 'border-green-400' : 'border-dashed border-gray-200 opacity-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🏨</span>
                    <p className="font-bold text-gray-900">Hotel</p>
                  </div>
                  {selectedHotel ? (
                    <>
                      <p className="text-xs text-gray-600 mb-1">{selectedHotel.name}</p>
                      <p className="text-green-600 font-bold text-sm">S/. {selectedHotel.price_per_night}/noche</p>
                      <button onClick={handleCancelHotel} className="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold underline">Quitar</button>
                    </>
                  ) : <p className="text-xs text-gray-400 italic">No seleccionado</p>}
                </div>

                {/* Tour Turístico */}
                <div className={`bg-white p-5 rounded-2xl border-2 shadow-lg transition-all ${selectedTour ? 'border-purple-400' : 'border-dashed border-gray-200 opacity-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🗺️</span>
                    <p className="font-bold text-gray-900">Tour</p>
                  </div>
                  {selectedTour ? (
                    <>
                      <p className="text-xs text-gray-600 mb-1">{selectedTour.name}</p>
                      <p className="text-purple-600 font-bold text-sm">S/. {selectedTour.price}</p>
                      <button onClick={handleCancelTour} className="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold underline">Quitar</button>
                    </>
                  ) : <p className="text-xs text-gray-400 italic">No seleccionado</p>}
                </div>

                {/* Servicios Adicionales */}
                <div className="bg-white p-5 rounded-2xl border-2 shadow-lg transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">💼</span>
                    <p className="font-bold text-gray-900">Servicios</p>
                  </div>
                  {selectedServices.length > 0 ? (
                    <div className="space-y-2">
                      {selectedServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div>
                            <p className="text-xs text-gray-600">{service.name}</p>
                            <p className="text-xs text-gray-500">{getCategoryLabel(service)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-bold text-cyan-600">S/. {service.price}</p>
                            <button 
                              onClick={() => handleCancelService(service.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-semibold underline"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No seleccionado</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleBooking}
                  disabled={!selectedFlight}
                  className={`px-10 py-5 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${!selectedFlight ? "bg-gray-400 cursor-not-allowed" : "bg-lams-orange hover:bg-lams-orange/90"}`}
                >
                  {selectedFlight ? "Confirmar Reserva" : "Selecciona un Vuelo"}
                </button>
              </div>
            </div>
          );
        })()}

        {/* Search / Management Section */}
        {user && (user.role === 'vendedor' || user.role === 'admin') ? (
          <div className="space-y-8 mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Panel de Administración
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setAdminTab('flights')}
                className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  adminTab === 'flights' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
                }`}
              >
                <i className="fa-solid fa-plane text-xl"></i>
                <span className="font-semibold">Inventario de Vuelos</span>
              </button>
              <button
                onClick={() => setAdminTab('hotels')}
                className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  adminTab === 'hotels' ? 'bg-green-600 text-white shadow-lg' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
                }`}
              >
                <i className="fa-solid fa-hotel text-xl"></i>
                <span className="font-semibold">Inventario de Hoteles</span>
              </button>
              <button
                onClick={() => setAdminTab('tours')}
                className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  adminTab === 'tours' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
                }`}
              >
                <i className="fa-solid fa-map-marked-alt text-xl"></i>
                <span className="font-semibold">Inventario de Tours</span>
              </button>
            </div>

            <div className="transition-all duration-300">
              {adminTab === 'flights' && <FlightManager />}
              {adminTab === 'hotels' && <HotelManager />}
              {adminTab === 'tours' && <TourManager />}
            </div>
          </div>
        ) : (
          <>
          {/* Main Search Panel - Elevated & Modernized */}
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-gray-100 mb-10 transform -translate-y-16 relative z-20 mx-4 md:mx-0">
            <div className="flex items-center space-x-4 mb-8 border-b pb-6 border-gray-100">
              <span className="bg-lams-orange text-white p-3 rounded-xl text-xl shadow-lg">
                <i className="fa-solid fa-location-dot"></i>
              </span>
              <h3 className="text-3xl font-bold text-gray-900">
                Planifica tu Próximo Destino
              </h3>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                Origen
              </label>
              <input
                type="text"
                placeholder="Ej: Lima, Arequipa, Cusco"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                Destino
              </label>
              <input
                type="text"
                placeholder="Ej: Cusco, Lima, Arequipa"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                Búsqueda Manual
              </label>
              <div className="flex gap-3">
              <button
                onClick={handleSearch}
                disabled={searching}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  searching
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-lams-navy hover:bg-lams-navy/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {searching ? (
                  <span className="flex items-center justify-center space-x-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Buscando...</span>
                  </span>
                ) : (
                      <span className="flex items-center justify-center space-x-2">
                    <i className="fa-solid fa-plane-departure"></i>
                    <span>Buscar Vuelos</span>
                  </span>
                )}
              </button>
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-purple-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Inteligencia AI
              </label>
              <button
                onClick={handlePackage}
                disabled={
                  searching || origin.length < 3 || destination.length < 3
                }
                className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-300 ${
                  searching || origin.length < 3 || destination.length < 3
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                    : "bg-lams-orange hover:bg-lams-orange/90 text-white shadow-[0_0_20px_rgba(239,125,36,0.4)] transform hover:-translate-y-1"
                }`}
              >
                {searching ? (
                  <span className="flex items-center justify-center space-x-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Analizando red...</span>
                  </span>
                ) : (
                      <span className="flex items-center justify-center space-x-2">
                    <i className="fa-solid fa-brain text-purple-200"></i>
                    <span className="tracking-wide">Paquete Magic AI</span>
                  </span>
                )}
              </button>
              {(origin.length < 3 || destination.length < 3) && (
                <p className="text-xs text-gray-500 mt-2">
                  Ingresa al menos 3 caracteres para activar el paquete
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {searching && (
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-200 mb-10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-xl font-medium">
              Buscando destinos perfectos para ti...
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            <h3 className="text-4xl font-bold text-gray-900 mb-8">
              Resultados de Búsqueda
            </h3>

            {/* Vuelos */}
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
              <button
                onClick={() => setShowFlights(!showFlights)}
                className={`w-full text-left font-bold text-xl p-6 rounded-xl transition-all duration-200 ${
                  showFlights
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-4">
                    <span>Vuelos Disponibles</span>
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {results.flights.length} encontrados
                  </span>
                </div>
              </button>

              {showFlights && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                  {results.flights
                    .filter((f) => {
                      const originMatch =
                        f.origin.toLowerCase().includes(origin.toLowerCase()) ||
                        f.origin_country
                          .toLowerCase()
                          .includes(origin.toLowerCase());
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
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
              <button
                onClick={() => setShowHotels(!showHotels)}
                disabled={!selectedFlight}
                className={`w-full text-left font-bold text-xl p-6 rounded-xl transition-all duration-200 ${
                  !selectedFlight
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : showHotels
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-4">
                    <span>Hoteles Disponibles</span>
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {results.hotels.length} encontrados
                  </span>
                </div>
              </button>

              {showHotels && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
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
            {(() => {
              const toursCategoryFilter = (t) => {
                if (selectedFlight) {
                  return t.location.toLowerCase() === selectedFlight.destination_city?.toLowerCase();
                } else {
                  return t.location.toLowerCase().includes(destination.toLowerCase());
                }
              };

              const toursRegulares = results.tours.filter(t => toursCategoryFilter(t) && (!t.category || t.category === 'tour'));
              // Los servicios adicionales son globales (location: "Global"/"Nacional"), se muestran siempre
              const serviciosAdicionales = results.tours.filter(t => t.category && t.category !== 'tour');

              return (
                <>
                  {/* Sección: Tours Turísticos */}
                  <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
                    <button
                      onClick={() => setShowTours(!showTours)}
                      disabled={!selectedFlight}
                      className={`w-full text-left font-bold text-xl p-6 rounded-xl transition-all duration-200 ${
                        !selectedFlight
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : showTours
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-3">
                          <i className="fa-solid fa-map-marked-alt"></i>
                          <span>Tours Turísticos</span>
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          {toursRegulares.length} encontrados
                        </span>
                      </div>
                    </button>

                    {showTours && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                        {toursRegulares.length > 0 ? toursRegulares.map((t) => (
                          <TourCard
                            key={t.id}
                            tour={t}
                            onSelect={setSelectedTour}
                            onBook={() => handleBookTour(t)}
                            user={user}
                          />
                        )) : (
                          <p className="text-gray-400 col-span-3 text-center py-4">No hay tours turísticos disponibles para este destino.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sección: Servicios Adicionales */}
                  {serviciosAdicionales.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl shadow-xl p-10 border border-blue-100">
                      <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center space-x-3">
                          <span className="bg-blue-600 text-white p-3 rounded-xl shadow">
                            <i className="fa-solid fa-briefcase text-lg"></i>
                          </span>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">Servicios Adicionales</h4>
                            <p className="text-sm text-gray-500">Complementa tu viaje con estos servicios</p>
                          </div>
                        </div>
                        <span className="text-base font-medium text-gray-500">{serviciosAdicionales.length} disponibles</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {serviciosAdicionales.map((t) => (
                          <ServiceCard
                            key={t.id}
                            service={t}
                            onSelect={(service) => {
                              setSelectedServices(prev => {
                                const isSelected = prev.some(s => s.id === service.id);
                                if (isSelected) {
                                  return prev.filter(s => s.id !== service.id);
                                } else {
                                  return [...prev, service];
                                }
                              });
                            }}
                            isSelected={selectedServices.some(s => s.id === t.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Servicios Especializados (Basados en la oferta real de Lams) */}
        <div className="mt-20 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lams-orange to-lams-navy inline-block">
              Nuestros Servicios Especializados
            </h2>
            <div className="h-1.5 w-24 bg-lams-orange mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Soluciones integrales para que tu única preocupación sea disfrutar del viaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {[
              { title: "Seguros de Viaje", icon: "fa-shield-halved", desc: "Asistencia médica internacional y protección 24/7.", color: "blue", wa: "Seguro de Viaje" },
              { title: "Trámites Pasaportes", icon: "fa-passport", desc: "Asesoría experta para la obtención y renovación de documentos.", color: "purple", wa: "Trámite de Pasaporte" },
              { title: "Traslados Full-Day", icon: "fa-car-side", desc: "Movilidad segura y cómoda en tus destinos favoritos.", color: "amber", wa: "Traslado Full-Day" },
              { title: "Paquetes Migratorios", icon: "fa-file-invoice", desc: "Gestión de visas y residencias con asesoría legal.", color: "cyan", wa: "Paquetes Migratorios" },
            ].map((service, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${service.color}-500/10 rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110`}></div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-${service.color}-600 text-white transform transition-transform duration-500 group-hover:rotate-12`}>
                  <i className={`fa-solid ${service.icon} text-2xl`}></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{service.desc}</p>
                <a
                  href={`https://wa.me/51967010925?text=${encodeURIComponent(`Hola Lams Viajes! Requiero información sobre el servicio de ${service.wa}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-2 font-bold text-${service.color}-600 hover:text-${service.color}-700 transition-colors`}
                >
                  <span>Consultar</span>
                  <i className="fa-solid fa-arrow-right-long text-xs transition-transform duration-300 group-hover:translate-x-2"></i>
                </a>
              </div>
            ))}
          </div>
        </div>

        {packageResult && (
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
            <h3 className="text-4xl font-bold text-gray-900 mb-8">
              Paquete Recomendado por IA
            </h3>
            <PackageCard
              packageData={packageResult}
              onSelectFlight={setSelectedFlight}
              onSelectHotel={setSelectedHotel}
              onSelectTour={setSelectedTour}
            />
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
