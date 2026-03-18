import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function HotelManager() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price_per_night: '',
    available_rooms: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels/');
      setHotels(response.data);
    } catch (error) {
      console.error('Error al cargar hoteles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (hotel) => {
    setEditingId(hotel.id);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price_per_night: hotel.price_per_night,
      available_rooms: hotel.available_rooms
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      price_per_night: '',
      available_rooms: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: formData.location,
      price_per_night: parseFloat(formData.price_per_night),
      available_rooms: parseInt(formData.available_rooms)
    };

    try {
      if (editingId) {
        await api.put(`/hotels/${editingId}`, payload);
        alert('Hotel actualizado exitosamente');
      } else {
        await api.post('/hotels/', payload);
        alert('Hotel creado exitosamente');
      }
      fetchHotels();
      handleCancelEdit();
    } catch (error) {
      console.error('Error al guardar hotel:', error);
      alert('Error al guardar el hotel');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este hotel?')) {
      try {
        await api.delete(`/hotels/${id}`);
        alert('Hotel eliminado');
        fetchHotels();
      } catch (error) {
        console.error('Error al eliminar hotel:', error);
        alert('Error al eliminar el hotel');
      }
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = hotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Gestión de Hoteles</h2>
      
      <form onSubmit={handleSave} className="mb-8 bg-green-50/50 border border-green-100 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-green-800">
          {editingId ? 'Editar Hotel' : 'Añadir Nuevo Hotel'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input required type="text" placeholder="Nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-800" />
          <input required type="text" placeholder="Ubicación" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-800" />
          <input required type="number" step="0.01" min="0" placeholder="Precio P/Noche (S/.)" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-800" />
          <input required type="number" min="0" placeholder="Habitaciones" value={formData.available_rooms} onChange={e => setFormData({...formData, available_rooms: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-800" />
          
          <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-3 items-end">
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                Cancelar
              </button>
            )}
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-lg transition-transform transform hover:scale-105">
              {editingId ? 'Actualizar' : 'Guardar Hotel'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Ubicación</th>
                <th className="p-4 font-semibold">Precio / Noche</th>
                <th className="p-4 font-semibold">Habitaciones</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentHotels.map(hotel => (
                <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{hotel.name}</td>
                  <td className="p-4 text-gray-600">{hotel.location}</td>
                  <td className="p-4 font-semibold text-green-600">S/. {hotel.price_per_night}</td>
                  <td className="p-4 text-gray-700">{hotel.available_rooms}</td>
                  <td className="p-4 text-center space-x-3">
                    <button onClick={() => handleEditClick(hotel)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Editar">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(hotel.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors" title="Eliminar">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No hay hoteles registrados en el inventario.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Controles de paginación */}
      {!loading && hotels.length > itemsPerPage && (
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
                    ? 'bg-green-600 text-white shadow-md'
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
