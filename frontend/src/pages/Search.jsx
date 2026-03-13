import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import FlightCard from '../components/FlightCard';
import HotelCard from '../components/HotelCard';
import TourCard from '../components/TourCard';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Estado para los resultados de búsqueda
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para filtros
  const [filters, setFilters] = useState({
    destination: '',
    date: '',
    maxPrice: '',
    hotelStars: '',
    tourType: ''
  });

  // Obtener parámetros de búsqueda de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destination = params.get('destination') || '';
    const date = params.get('date') || '';
    
    setFilters(prev => ({
      ...prev,
      destination,
      date
    }));

    if (destination) {
      performSearch(destination, date);
    }
  }, [location.search]);

  const performSearch = async (destination, date) => {
    if (!destination) {
      setError('Por favor ingrese un destino');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Realizar búsqueda en paralelo
      const [flightsRes, hotelsRes, toursRes] = await Promise.all([
        fetch(`/api/search/flights?destination=${encodeURIComponent(destination)}&date=${date || ''}`),
        fetch(`/api/search/hotels?destination=${encodeURIComponent(destination)}&date=${date || ''}`),
        fetch(`/api/search/tours?destination=${encodeURIComponent(destination)}&date=${date || ''}`)
      ]);

      const flightsData = await flightsRes.json();
      const hotelsData = await hotelsRes.json();
      const toursData = await toursRes.json();

      setFlights(flightsData);
      setHotels(hotelsData);
      setTours(toursData);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('Error al realizar la búsqueda. Por favor intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.destination) params.set('destination', filters.destination);
    if (filters.date) params.set('date', filters.date);
    navigate(`/search?${params.toString()}`);
  };

  const handleBook = async (type, item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Crear reserva
      const bookingData = {
        user_id: user.id,
        flight_id: item.flight_id || item.id, // Para vuelos, usar el ID directamente
        hotel_id: type === 'hotel' ? item.id : null,
        tour_id: type === 'tour' ? item.id : null,
        total_price: item.price || item.price_per_night
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert('Reserva realizada exitosamente');
        // Redirigir al dashboard o a una página de confirmación
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Error al realizar la reserva: ${errorData.detail || 'Intente de nuevo'}`);
      }
    } catch (err) {
      console.error('Error al crear la reserva:', err);
      alert('Error al realizar la reserva. Por favor intente de nuevo.');
    }
  };

  const filteredFlights = flights.filter(flight => {
    if (filters.maxPrice && flight.price > parseFloat(filters.maxPrice)) return false;
    return true;
  });

  const filteredHotels = hotels.filter(hotel => {
    if (filters.maxPrice && hotel.price_per_night > parseFloat(filters.maxPrice)) return false;
    if (filters.hotelStars && hotel.stars !== parseInt(filters.hotelStars)) return false;
    return true;
  });

  const filteredTours = tours.filter(tour => {
    if (filters.maxPrice && tour.price > parseFloat(filters.maxPrice)) return false;
    if (filters.tourType && tour.type !== filters.tourType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buscar Viajes</h1>
              <p className="mt-1 text-sm text-gray-600">
                Encuentra tu próximo destino perfecto
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Bienvenido, {user.name}
                  </span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros de Búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino
              </label>
              <input
                type="text"
                value={filters.destination}
                onChange={(e) => setFilters({...filters, destination: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Cusco, Lima, Arequipa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Viaje
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Máximo
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 500"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Mensajes de Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Resultados de Búsqueda */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Buscando destinos...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Vuelos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vuelos Disponibles</h2>
              {filteredFlights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onBook={() => handleBook('flight', flight)}
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No hay vuelos disponibles para estos criterios.</p>
                </div>
              )}
            </section>

            {/* Hoteles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoteles Disponibles</h2>
              {filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onBook={() => handleBook('hotel', hotel)}
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No hay hoteles disponibles para estos criterios.</p>
                </div>
              )}
            </section>

            {/* Tours */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tours Disponibles</h2>
              {filteredTours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      onBook={() => handleBook('tour', tour)}
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No hay tours disponibles para estos criterios.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;