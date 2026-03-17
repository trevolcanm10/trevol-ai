import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function TourManager() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    available_slots: ''
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/tours/');
      setTours(response.data);
    } catch (error) {
      console.error('Error al cargar tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tour) => {
    setEditingId(tour.id);
    setFormData({
      name: tour.name,
      location: tour.location,
      price: tour.price,
      available_slots: tour.available_slots
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      price: '',
      available_slots: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: formData.location,
      price: parseFloat(formData.price),
      available_slots: parseInt(formData.available_slots)
    };

    try {
      if (editingId) {
        await api.put(`/tours/${editingId}`, payload);
        alert('Tour actualizado exitosamente');
      } else {
        await api.post('/tours/', payload);
        alert('Tour creado exitosamente');
      }
      fetchTours();
      handleCancelEdit();
    } catch (error) {
      console.error('Error al guardar tour:', error);
      alert('Error al guardar el tour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este tour?')) {
      try {
        await api.delete(`/tours/${id}`);
        alert('Tour eliminado');
        fetchTours();
      } catch (error) {
        console.error('Error al eliminar tour:', error);
        alert('Error al eliminar el tour');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Gestión de Tours</h2>
      
      <form onSubmit={handleSave} className="mb-8 bg-purple-50/50 border border-purple-100 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-purple-800">
          {editingId ? 'Editar Tour' : 'Añadir Nuevo Tour'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input required type="text" placeholder="Nombre del Tour" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800" />
          <input required type="text" placeholder="Ubicación" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800" />
          <input required type="number" step="0.01" min="0" placeholder="Precio (S/.)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800" />
          <input required type="number" min="0" placeholder="Plazas Dispo." value={formData.available_slots} onChange={e => setFormData({...formData, available_slots: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800" />
          
          <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-3 items-end">
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                Cancelar
              </button>
            )}
            <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 shadow-lg transition-transform transform hover:scale-105">
              {editingId ? 'Actualizar' : 'Guardar Tour'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Ubicación</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Plazas</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tours.map(tour => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{tour.name}</td>
                  <td className="p-4 text-gray-600">{tour.location}</td>
                  <td className="p-4 font-semibold text-purple-600">S/. {tour.price}</td>
                  <td className="p-4 text-gray-700">{tour.available_slots}</td>
                  <td className="p-4 text-center space-x-3">
                    <button onClick={() => handleEditClick(tour)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Editar">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(tour.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors" title="Eliminar">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {tours.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No hay tours registrados en el inventario.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
