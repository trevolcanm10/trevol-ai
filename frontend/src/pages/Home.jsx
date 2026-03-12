import { useState, useEffect } from "react"; // importando el hook useState y useEffect
import { searchTravel, getPackage } from "../services/api"; // importando las funciones de la api
import FlightCard from "../components/FlightCard"; // importando el componente FlightCard
import HotelCard from "../components/HotelCard"; // importando el componente HotelCard
import TourCard from "../components/TourCard"; // importando el componente TourCard
import PackageCard from "../components/PackageCard"; // importando el componente PackageCard
import { createBooking } from "../services/api";
// Definimos el componente Home
export default function Home(){
    const [origin, setOrigin] = useState(""); // Definimos el estado origin
    const [destination, setDestination] = useState(""); // Definimos el estado destination
    const [results, setResults] = useState(null); // Definimos el estado results
    const [packageResult,setPackageResult] = useState(null); // Definimos el estado packageResult
    const [selectedFlight, setSelectedFlight] = useState(null); // Definimos el estado selectedFlight
    const [selectedHotel, setSelectedHotel] = useState(null); // Definimos el estado selectedHotel
    const [selectedTour, setSelectedTour] = useState(null); // Definimos el estado selectedTour
    const [showFlights, setShowFlights] = useState(false); // Definimos el estado showFlights
    const [showHotels, setShowHotels] = useState(false); // Definimos el estado showHotels
    const [showTours, setShowTours] = useState(false); // Definimos el estado showTours
    const [debounceTimer, setDebounceTimer] = useState(null); // Para el debounce del paquete recomendado

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
      // Definimos la función handleSearch
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

    const handlePackage = async () => { // Definimos la función handlePackage
      try{
        const response = await getPackage(origin.trim(), destination.trim());
        setResults(null); // limpiamos el estado results
        setPackageResult(response.data); // seteamos el estado packageResult con la respuesta de la api
      }catch(error){
        console.error("Error al obtener paquete:", error);
        alert("No se encontró un paquete para ese origen y destino");
      }
    };
    
    const handleBooking = async () => {
      if (!selectedFlight) {
        alert("Debes seleccionar un vuelo primero");
        return;
      }
      try {
        await createBooking({
          user_id: 1,
          flight_id: selectedFlight?.id,
          hotel_id: selectedHotel?.id,
          tour_id: selectedTour?.id,
        });

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

    const handleSelectFlight = (flight) => {
      setSelectedFlight(flight);
      setSelectedHotel(null);
      setSelectedTour(null);
      setShowHotels(true);
      setShowTours(true);
    };
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Travel-AI</h1>
        {(selectedFlight || selectedHotel || selectedTour) && (
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="font-bold mb-2">Tu viaje seleccionado</h2>

            {selectedFlight && (
              <p>
                ✈️ Vuelo: {selectedFlight.origin} ({selectedFlight.origin_country}) → {selectedFlight.destination_city}, {selectedFlight.destination_country}
              </p>
            )}

            {selectedHotel && <p>🏨 Hotel: {selectedHotel.name}</p>}

            {selectedTour && <p>🗺 Tour: {selectedTour.name}</p>}

            <button
              onClick={handleCancelSelection}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Cancelar selección
            </button>
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
              {showFlights ? "▼ Vuelos" : "▶ Vuelos"} ({results.flights.length} encontrados)
            </button>

            {showFlights &&
              results.flights
                .filter((f) => {
                  const originMatch = f.origin.toLowerCase().includes(origin.toLowerCase()) ||
                                    f.origin_country.toLowerCase().includes(origin.toLowerCase());
                  const destinationMatch = f.destination_city.toLowerCase().includes(destination.toLowerCase()) ||
                                         f.destination_country.toLowerCase().includes(destination.toLowerCase());
                  return originMatch && destinationMatch;
                })
                .map((f) => (
                  <FlightCard
                    key={f.id}
                    flight={f}
                    onSelect={handleSelectFlight}
                  />
                ))}

            {/* Hoteles */}
            <button
              onClick={() => setShowHotels(!showHotels)}
              className="font-bold mt-2 bg-gray-200 p-2 rounded w-full text-left"
            >
              {showHotels ? "▼ Hoteles" : "▶ Hoteles"} ({results.hotels.length} encontrados)
            </button>

            {showHotels &&
              results.hotels
                .filter((h) => {
                  if (selectedFlight) {
                    // Escenario B: Con vuelo seleccionado, comparar con destination_city
                    return h.location.toLowerCase() === selectedFlight.destination_city?.toLowerCase();
                  } else {
                    // Escenario A: Sin vuelo seleccionado, filtrar por input de destino
                    return h.location.toLowerCase().includes(destination.toLowerCase());
                  }
                })
                .map((h) => (
                  <HotelCard key={h.id} hotel={h} onSelect={setSelectedHotel} />
                ))}

            {/* Tours */}
            <button
              onClick={() => setShowTours(!showTours)}
              className="font-bold mt-2 bg-gray-200 p-2 rounded w-full text-left"
            >
              {showTours ? "▼ Tours" : "▶ Tours"} ({results.tours.length} encontrados)
            </button>

            {showTours &&
              results.tours
                .filter((t) => {
                  if (selectedFlight) {
                    // Escenario B: Con vuelo seleccionado, comparar con destination_city
                    return t.location.toLowerCase() === selectedFlight.destination_city?.toLowerCase();
                  } else {
                    // Escenario A: Sin vuelo seleccionado, filtrar por input de destino
                    return t.location.toLowerCase().includes(destination.toLowerCase());
                  }
                })
                .map((t) => (
                  <TourCard key={t.id} tour={t} onSelect={setSelectedTour} />
                ))}

            <button
              onClick={handleBooking}
              disabled={!selectedFlight}
              className={`p-3 rounded mt-4 ${
                !selectedFlight 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Confirmar reserva
            </button>
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