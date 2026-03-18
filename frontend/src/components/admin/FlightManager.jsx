import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FlightManager() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    price: '',
    available_seats: ''
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await api.get('/flights/');
      setFlights(response.data);
    } catch (error) {
      console.error('Error al cargar vuelos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (flight) => {
    setEditingId(flight.id);
    const formattedDate = flight.departure_date ? flight.departure_date.slice(0, 16) : '';
    setFormData({
      origin: flight.origin,
      destination: flight.destination,
      departure_date: formattedDate,
      price: flight.price,
      available_seats: flight.available_seats
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      origin: '',
      destination: '',
      departure_date: '',
      price: '',
      available_seats: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formattedDate = new Date(formData.departure_date).toISOString();

    const payload = {
      origin: formData.origin,
      destination: formData.destination,
      departure_date: formattedDate,
      price: parseFloat(formData.price),
      available_seats: parseInt(formData.available_seats)
    };

    try {
      if (editingId) {
        await api.put(`/flights/${editingId}`, payload);
        alert('Vuelo actualizado exitosamente');
      } else {
        await api.post('/flights/', payload);
        alert('Vuelo creado exitosamente');
      }
      fetchFlights();
      handleCancelEdit();
    } catch (error) {
      console.error('Error al guardar vuelo:', error);
      alert('Error al guardar el vuelo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este vuelo?')) {
      try {
        await api.delete(`/flights/${id}`);
        alert('Vuelo eliminado');
        fetchFlights();
      } catch (error) {
        console.error('Error al eliminar vuelo:', error);
        alert('Error al eliminar el vuelo');
      }
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFlights = flights.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flights.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Gestión de Vuelos</h2>
      
      <form onSubmit={handleSave} className="mb-8 bg-blue-50/50 border border-blue-100 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">
          {editingId ? 'Editar Vuelo' : 'Crear Nuevo Vuelo'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input required type="text" placeholder="Origen" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
          <input required type="text" placeholder="Destino" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
          <input required type="datetime-local" value={formData.departure_date} onChange={e => setFormData({...formData, departure_date: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
          <input required type="number" step="0.01" min="0" placeholder="Precio (S/.)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
          <input required type="number" min="1" placeholder="Asientos Dispo." value={formData.available_seats} onChange={e => setFormData({...formData, available_seats: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
          
          <div className="flex justify-end space-x-3 items-end">
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                Cancelar
              </button>
            )}
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105">
              {editingId ? 'Actualizar' : 'Guardar Vuelo'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Ruta</th>
                <th className="p-4 font-semibold">Regreso</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Asientos</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentFlights.map(flight => (
                <tr key={flight.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-gray-900">{flight.origin}</span> 
                    <i className="fa-solid fa-arrow-right mx-2 text-gray-400"></i>
                    <span className="font-bold text-gray-900">{flight.destination}</span>
                  </td>
                  <td className="p-4 text-gray-600">{new Date(flight.departure_date).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-green-600">S/. {flight.price}</td>
                  <td className="p-4 text-gray-700">{flight.available_seats}</td>
                  <td className="p-4 text-center space-x-3">
                    <button onClick={() => handleEditClick(flight)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Editar">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(flight.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors" title="Eliminar">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {flights.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No hay vuelos registrados en el inventario.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Controles de paginación */}
      {!loading && flights.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
            }`}
          >
            Anterior
          </button>
          
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
