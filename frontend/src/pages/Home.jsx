import { useState } from "react"; // importando el hook useState
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
    const handleSearch = async () => { // Definimos la función handleSearch
        const response = await searchTravel({ origin:origin.trim(), destination:destination.trim() }); // llamamos a la función searchTravel
        setResults(response.data); // seteamos el estado results con la respuesta de la api
    };

    const handlePackage = async () => { // Definimos la función handlePackage
      try{
        const response = await getPackage(origin.trim(), destination.trim()); // llamamos a la función getPackage
        setPackageResult(response.data); // seteamos el estado packageResult con la respuesta de la api
      }catch(error){
        console.error("Error al obtener paquete:", error);
        alert("No se encontró un paquete para ese origen y destino");
      }
    };
    
    const handleBooking = async () => {
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
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Travel-AI</h1>

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
            <h3 className="font-bold mt-2">Vuelos</h3>
            {results.flights.map((f) => (
              <FlightCard key={f.id} flight={f} onSelect={setSelectedFlight} />
            ))}

            <h3 className="font-bold mt-2">Hoteles</h3>
            {results.hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} onSelect={setSelectedHotel} />
            ))}

            <h3 className="font-bold mt-2">Tours</h3>
            {results.tours.map((t) => (
              <TourCard key={t.id} tour={t} onSelect={setSelectedTour} />
            ))}
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

        <button
          onClick={handleBooking}
          className="bg-purple-600 text-white p-3 rounded mt-4 hover:bg-purple-700"
        >
          Confirmar reserva
        </button>
      </div>
    );
}