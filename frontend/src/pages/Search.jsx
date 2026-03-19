import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import FlightCard from '../components/FlightCard';
import HotelCard from '../components/HotelCard';
import TourCard from '../components/TourCard';
import FlightManager from '../components/admin/FlightManager';
import HotelManager from '../components/admin/HotelManager';
import TourManager from '../components/admin/TourManager';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Estado para los resultados de búsqueda
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [adminTab, setAdminTab] = useState('flights'); // "flights", "hotels", "tours"

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

    setSearching(true);
    setError('');
    
    try {
      // Simular búsqueda real con la API existente
      const response = await fetch(`/api/search?destination=${encodeURIComponent(destination)}&date=${date || ''}`);
      const data = await response.json();

      setFlights(data.flights || []);
      setHotels(data.hotels || []);
      setTours(data.tours || []);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('Error al realizar la búsqueda. Por favor intente de nuevo.');
    } finally {
      setSearching(false);
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
      alert("Debes iniciar sesión para realizar una reserva");
      navigate('/login');
      return;
    }

    try {
      // Crear reserva usando la API existente
      const bookingData = {
        flight_id: type === 'flight' ? item.id : null,
        hotel_id: type === 'hotel' ? item.id : null,
        tour_id: type === 'tour' ? item.id : null,
      };

      const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert('Reserva realizada exitosamente');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lams-navy/30 to-lams-orange/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-lams-orange rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-white">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Buscar Viajes
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Encuentra tu próximo destino perfecto con <span className="text-lams-orange font-bold uppercase">Lams Viajes</span>
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Admin Management Interface */}
        {(user && (user.role === 'vendedor' || user.role === 'admin')) ? (
          <div className="space-y-8">
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
            {/* Filtros de Búsqueda */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🎛️ Filtros de Búsqueda Avanzados</h3>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Destino
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={filters.destination}
                  onChange={(e) => setFilters({...filters, destination: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lams-orange focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Cusco, Lima, Arequipa"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Fecha de Viaje
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Precio Máximo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">S/.</span>
                </div>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="500"
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={searching}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  searching
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-lams-navy hover:bg-lams-navy/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {searching ? "🔍 Buscando..." : "🔍 Buscar Destinos"}
              </button>
            </div>
          </form>
        </div>

        {/* Mensajes de Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </span>
          </div>
        )}

        {/* Resultados de Búsqueda */}
        {searching && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 mb-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lams-orange mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Buscando destinos perfectos para ti...</p>
            <p className="text-sm text-gray-500 mt-2">Estamos analizando las mejores opciones</p>
          </div>
        )}

        {!searching && (
          <div className="space-y-12">
            {/* Vuelos */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-lams-orange/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-lams-orange">
                      <i className="fa-solid fa-plane"></i>
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Vuelos Disponibles</h2>
                    <p className="text-gray-600">Encuentra el vuelo perfecto para tu destino</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-lams-orange">{filteredFlights.length}</span>
                  <p className="text-sm text-gray-500">vuelos encontrados</p>
                </div>
              </div>
              
              {filteredFlights.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay vuelos disponibles</h3>
                  <p className="text-gray-600">Intenta con otros criterios de búsqueda o destinos diferentes</p>
                </div>
              )}
            </section>

            {/* Hoteles */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Hoteles Disponibles</h2>
                    <p className="text-gray-600">Descubre los mejores lugares para hospedarte</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">{filteredHotels.length}</span>
                  <p className="text-sm text-gray-500">hoteles encontrados</p>
                </div>
              </div>
              
              {filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay hoteles disponibles</h3>
                  <p className="text-gray-600">Intenta con otros criterios de búsqueda o destinos diferentes</p>
                </div>
              )}
            </section>

            {/* Tours */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Tours Disponibles</h2>
                    <p className="text-gray-600">Explora experiencias inolvidables en tu destino</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600">{filteredTours.length}</span>
                  <p className="text-sm text-gray-500">tours encontrados</p>
                </div>
              </div>
              
              {filteredTours.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay tours disponibles</h3>
                  <p className="text-gray-600">Intenta con otros criterios de búsqueda o destinos diferentes</p>
                </div>
              )}
            </section>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
};

export default Search;
