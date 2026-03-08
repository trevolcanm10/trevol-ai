import { useState } from "react"; // importando el hook useState
import { searchTravel, getPackage } from "../services/api"; // importando las funciones de la api

// Definimos el componente Home
export default function Home(){
    const [origin, setOrigin] = useState(""); // Definimos el estado origin
    const [destination, setDestination] = useState(""); // Definimos el estado destination
    const [results, setResults] = useState(null); // Definimos el estado results
    const [packageResult,setPackageResult] = useState(null); // Definimos el estado packageResult

    const handleSearch = async () => { // Definimos la función handleSearch
        const response = await searchTravel({ origin, destination }); // llamamos a la función searchTravel
        setResults(response.data); // seteamos el estado results con la respuesta de la api
    };

    const handlePackage = async () => { // Definimos la función handlePackage
        const response = await getPackage(origin, destination); // llamamos a la función getPackage
        setPackageResult(response.data); // seteamos el estado packageResult con la respuesta de la api
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
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}

        {packageResult && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Paquete recomendado</h2>
            <pre>{JSON.stringify(packageResult, null, 2)}</pre>
          </div>
        )}
      </div>
    );

}