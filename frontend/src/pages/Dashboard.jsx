import api from "../services/api";// importando las funciones de la api
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    topDestinations: [],
    monthlyRevenue: [],
    recentBookings: [],
    customers: [],
    revenueByCategory: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats"); // "stats" o "customers"
  const [currentPage, setCurrentPage] = useState(1); // Para la paginación
  const [customerSearch, setCustomerSearch] = useState(""); // Para la busqueda
  const itemsPerPage = 3; // Número de elementos por página
  const navigate = useNavigate(); // importando useNavigate
  const { user, logout } = useAuth(); // importando el hook useAuth
  const [showBookings, setShowBookings] = useState(false); // Para mostrar los viajes
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar modal
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "vendedor" && user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [
        revenueRes,
        bookingsRes,
        destinationsRes,
        monthlyRes,
        recentRes,
        customersRes,
        categoryRes,
      ] = await Promise.all([
        api.get("/dashboard/revenue"),
        api.get("/dashboard/bookings"),
        api.get("/dashboard/top-destinations"),
        api.get("/dashboard/monthly-revenue"),
        api.get("/dashboard/recent-bookings"),
        api.get("/dashboard/customers"),
        api.get("/dashboard/revenue-by-category"),
      ]);

      setStats({
        totalRevenue: revenueRes.data.total_revenue || 0,
        totalBookings: bookingsRes.data.total_bookings || 0,
        topDestinations: destinationsRes.data || [],
        monthlyRevenue: monthlyRes.data || [],
        recentBookings: recentRes.data || [],
        customers: customersRes.data || [],
        revenueByCategory: categoryRes.data || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin border-4 border-white/20"></div>
            <div className="text-lg font-semibold text-gray-900">
              Cargando dashboard...
            </div>
            <div className="text-sm text-gray-600">
              Analizando datos de viajes
            </div>
          </div>
        </div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = stats.recentBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(stats.recentBookings.length / itemsPerPage);
  const handleOpenBookingModal = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);

      console.log("BOOKING COMPLETO:", response.data);

      setSelectedBooking(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error cargando reserva:", error);
    }
  };

  const handleCloseBookingModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-lams-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">
                LAMS <span className="text-lams-orange">VIAJES</span>
              </h1>
              <p className="text-blue-100 text-lg">
                Viaja • Sueña • Imagina | Bienvenido, {user?.name || "Usuario"}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                  Rol: {user?.role || "Cliente"}
                </span>
                <span className="text-blue-200 text-sm">
                  Última actualización: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ← Volver al Home
              </button>
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
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-sm flex items-center space-x-2 ${
              activeTab === "stats"
                ? "bg-lams-orange text-white transform scale-105 shadow-lams-orange/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Estadísticas y Ventas</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("customers");
              setCurrentPage(1);
            }}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-sm flex items-center space-x-2 ${
              activeTab === "customers"
                ? "bg-lams-navy text-white transform scale-105 shadow-lams-navy/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Gestión de Clientes</span>
          </button>
        </div>

        {activeTab === "stats" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                      Ingresos Totales
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      S/. {stats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-green-200 text-sm mt-1">
                      Reservas exitosas
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                      Reservas Totales
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      {stats.totalBookings}
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                      Clientes satisfechos
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">
                      Destino Top #1
                    </p>
                    <p
                      className="text-2xl font-bold mt-2 truncate max-w-[200px]"
                      title={stats.topDestinations[0]?.destination || "N/A"}
                    >
                      {stats.topDestinations[0]?.destination || "N/A"}
                    </p>
                    <p className="text-purple-200 text-sm mt-1">
                      {stats.topDestinations[0]?.total_sales || 0} ventas
                      registradas
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Top Destinations - Pie Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Destinos Más Vendidos
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-lams-orange rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Análisis de preferencias
                    </span>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.topDestinations}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ destination, percent }) =>
                          `${destination} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="total_sales"
                      >
                        {stats.topDestinations.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Revenue - Bar Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ingresos Mensuales
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-lams-navy rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Tendencia de ingresos
                    </span>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Revenue by Category - Bar Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Ventas por Categoría de Servicio
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-lams-orange rounded-full"></div>
                  <span className="text-sm text-gray-600">Servicios Lams</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.revenueByCategory}
                    layout="vertical"
                    margin={{ left: 30, right: 30 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      vertical={true}
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="category"
                      type="category"
                      width={100}
                      tick={{
                        fontSize: 13,
                        fontWeight: "bold",
                        fill: "#374151",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `S/. ${value.toLocaleString()}`,
                        "Ingresos",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#ef7d24"
                      radius={[0, 10, 10, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Secondary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Tendencia de Reservas - Line Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Tendencia de Reservas
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Evolución mensual
                    </span>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bookingsCount"
                        name="Reservas"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Crecimiento de Ingresos - Area Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Crecimiento de Ingresos
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Volumen acumulado
                    </span>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Ingresos (Área)"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-10">
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  Reservas Recientes
                </h3>
                <p className="text-gray-600 mt-1">
                  Actividad de los últimos 30 días
                </p>
              </div>
              <div className="p-8">
                {stats.recentBookings.length > 0 ? (
                  <div className="space-y-6">
                    {currentBookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        onClick={() => handleOpenBookingModal(booking.id)}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-lams-orange rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {booking.destination.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                              {booking.destination}
                            </h4>
                            <div className="flex items-center space-x-4 text-gray-600">
                              <span className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>Reserva #{booking.id}</span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>
                                  {new Date(
                                    booking.booking_date,
                                  ).toLocaleDateString()}
                                </span>
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2">
                              Cliente:{" "}
                              <span className="font-semibold">
                                {booking.user_name}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            S/. {booking.total_price}
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            ✅ Confirmado
                          </span>
                        </div>
                      </div>
                    ))}

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          Mostrando{" "}
                          <span className="font-semibold">
                            {indexOfFirstItem + 1}
                          </span>{" "}
                          a{" "}
                          <span className="font-semibold">
                            {Math.min(
                              indexOfLastItem,
                              stats.recentBookings.length,
                            )}
                          </span>{" "}
                          de{" "}
                          <span className="font-semibold">
                            {stats.recentBookings.length}
                          </span>{" "}
                          reservas
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            Anterior
                          </button>
                          <div className="flex items-center space-x-1">
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                                  currentPage === i + 1
                                    ? "bg-lams-orange text-white shadow-md transform scale-105"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-300"
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No hay reservas recientes
                    </h3>
                    <p className="text-gray-600">
                      Las reservas aparecerán aquí cuando se realicen.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-lams-navy to-blue-900 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Directorio de Clientes
                </h3>
                <p className="text-blue-100 mt-1">
                  Contacta directamente a tus viajeros para cerrar ventas
                </p>
              </div>
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-lams-orange transition-all"
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="p-8">
              {stats.customers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.customers
                    .filter(
                      (c) =>
                        c.name
                          .toLowerCase()
                          .includes(customerSearch.toLowerCase()) ||
                        c.email
                          .toLowerCase()
                          .includes(customerSearch.toLowerCase()),
                    )
                    .map((customer, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-14 h-14 bg-lams-orange rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg leading-tight">
                              {customer.name}
                            </h4>
                            <p className="text-gray-500 text-sm overflow-hidden text-ellipsis">
                              {customer.email}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600 text-sm">
                            <svg
                              className="w-4 h-4 mr-2 text-lams-navy"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{customer.phone || "Sin teléfono"}</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              Registrado el{" "}
                              {new Date(
                                customer.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                          <a
                            href={`tel:${customer.phone}`}
                            className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${
                              customer.phone
                                ? "bg-white border-2 border-lams-navy text-lams-navy hover:bg-lams-navy hover:text-white"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>Llamar</span>
                          </a>
                          <a
                            href={
                              customer.phone
                                ? `https://wa.me/51${customer.phone.replace(/\s+/g, "")}?text=Hola ${encodeURIComponent(customer.name)}, te escribo de Lams Viajes sobre tu interés en viajar con nosotros.`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${
                              customer.phone
                                ? "bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-green-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <i className="fa-brands fa-whatsapp text-lg"></i>
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Aún no hay clientes registrados
                  </h3>
                  <p className="text-gray-500">
                    Los clientes aparecerán aquí una vez creen una cuenta en la
                    web.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Resumen de Reserva #{selectedBooking.id}
            </h2>
            <p>
              <strong>Cliente:</strong> {selectedBooking.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.user?.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {selectedBooking.user?.phone}
            </p>
            <p>
              <strong>Destino:</strong> {selectedBooking.flight?.origin} →{" "}
              {selectedBooking.flight?.destination}
            </p>
            <p>
              <strong>Fecha de Reserva:</strong>{" "}
              {new Date(selectedBooking.booking_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Total:</strong> S/. {selectedBooking.total_price}
            </p>

            <h3 className="mt-4 font-semibold">Servicios</h3>
            <ul className="list-disc ml-5">
              {(selectedBooking.services || []).map((s, idx) => (
                <li key={idx}>
                  {s.service?.name} ({s.service?.category}) x{s.quantity} - S/.{" "}
                  {s.service?.price * s.quantity}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-lams-navy text-white py-2 rounded-xl font-bold hover:bg-blue-800 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Colors for the pie chart
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default Dashboard;
