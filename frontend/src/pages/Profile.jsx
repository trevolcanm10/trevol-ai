import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authService";
import api from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/profile");
      setUser(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Error al cargar el perfil");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage("El nombre es requerido");
      setMessageType("error");
      return false;
    }
    if (!formData.email.trim()) {
      setMessage("El email es requerido");
      setMessageType("error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage("Email inválido");
      setMessageType("error");
      return false;
    }
    if (formData.phone && !/^\d{9}$/.test(formData.phone)) {
      setMessage("Número de teléfono inválido (requiere 9 dígitos)");
      setMessageType("error");
      return false;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put("/auth/profile", updateData);
      
      setMessage("Perfil actualizado exitosamente");
      setMessageType("success");
      setEditing(false);
      fetchUserProfile();
      
      // Limpiar formulario
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error al actualizar el perfil");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin border-4 border-white/20"></div>
            <div className="text-lg font-semibold text-gray-900">Cargando perfil...</div>
            <div className="text-sm text-gray-600">Obteniendo datos del usuario</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
              <p className="text-blue-100 text-lg">
                Gestiona tu información personal y preferencias
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {(user?.role === 'vendedor' || user?.role === 'admin') && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  ← Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message && (
          <div className={`mb-8 p-6 rounded-2xl border-2 ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : messageType === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  messageType === 'success' ? 'bg-green-500' : 
                  messageType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {messageType === 'success' ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : messageType === 'error' ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold">{message}</span>
              </div>
              <button
                onClick={() => setMessage("")}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.name || "Usuario"}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Rol: {user?.role || "Cliente"}</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {(user?.role === 'vendedor' || user?.role === 'admin') && (
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Ver Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Volver al Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editing ? "Editar Información" : "Información Personal"}
                </h3>
                <button
                  onClick={() => {
                    if (editing) {
                      // Cancelar edición y recargar datos
                      fetchUserProfile();
                    }
                    setEditing(!editing);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    editing 
                      ? "bg-gray-500 hover:bg-gray-600 text-white" 
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  }`}
                >
                  {editing ? "Cancelar" : "Editar Perfil"}
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        editing 
                          ? "border-gray-300 focus:ring-blue-500 focus:border-transparent" 
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        editing 
                          ? "border-gray-300 focus:ring-blue-500 focus:border-transparent" 
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        editing 
                          ? "border-gray-300 focus:ring-blue-500 focus:border-transparent" 
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder="987654321"
                      maxLength="9"
                    />
                    {editing && formData.phone && !/^\d{9}$/.test(formData.phone) && (
                      <p className="text-red-500 text-sm mt-1">Número inválido (requiere 9 dígitos)</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        editing 
                          ? "border-gray-300 focus:ring-blue-500 focus:border-transparent" 
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder={editing ? "Nueva contraseña (opcional)" : "••••••••"}
                    />
                  </div>
                </div>

                {editing && formData.password && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                      }`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Fecha de Registro
                    </label>
                    <div className="w-full px-4 py-4 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
                      {formatDate(user?.created_at)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Última Actualización
                    </label>
                    <div className="w-full px-4 py-4 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
                      {formatDate(user?.updated_at)}
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 py-4 rounded-lg font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Guardando...</span>
                        </span>
                      ) : (
                        "Guardar Cambios"
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;