import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authService';
import { getUserBookings } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Package = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await getUserBookings();
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('No se pudieron cargar tus viajes. Por favor, intenta de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-lams-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-lams-navy mb-4 tracking-tight">
                        Mis <span className="text-lams-orange tracking-wide">Aventuras</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Aquí tienes un resumen de todas tus experiencias reservadas con Lams Viajes.
                    </p>
                </header>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 text-red-400 text-xl">⚠️</div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-[2rem] shadow-xl p-16 text-center border border-gray-100">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🌍</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Aún no tienes viajes</h2>
                        <p className="text-gray-500 mb-10 max-w-md mx-auto">
                            Parece que todavía no has reservado ninguna aventura. ¡Es el momento perfecto para empezar!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-lams-orange text-white px-10 py-4 rounded-2xl font-bold hover:bg-lams-orange/90 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
                        >
                            Explorar Destinos
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="p-8 md:p-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest rounded-full mb-3">
                                                {booking.status === 'confirmed' ? 'Confirmado' : booking.status}
                                            </span>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                Reserva #{booking.id}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Reservado el {new Date(booking.booking_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 uppercase font-black tracking-widest mb-1">Total</p>
                                            <p className="text-3xl font-black text-lams-orange">S/. {booking.total_price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Vuelo */}
                                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden group">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <span className="p-2 bg-lams-orange/10 text-lams-orange rounded-lg">✈️</span>
                                                <h4 className="font-bold text-gray-800">Vuelo</h4>
                                            </div>
                                            {booking.flight ? (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">De</span>
                                                        <span className="text-sm font-bold text-gray-700">{booking.flight.origin}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">A</span>
                                                        <span className="text-sm font-bold text-gray-700">{booking.flight.destination}</span>
                                                    </div>
                                                    <div className="pt-2 border-t border-blue-100 mt-2">
                                                        <p className="text-xs text-gray-500 font-medium">
                                                            {new Date(booking.flight.departure_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400">No incluido</p>
                                            )}
                                        </div>

                                        {/* Hotel */}
                                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 group">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">🏨</span>
                                                <h4 className="font-bold text-gray-800">Hotel</h4>
                                            </div>
                                            {booking.hotel ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold text-gray-700 truncate">{booking.hotel.name}</p>
                                                    <p className="text-xs text-gray-500">{booking.hotel.location}</p>
                                                    <div className="pt-2 border-t border-emerald-100 mt-2">
                                                        <p className="text-xs text-emerald-600 font-bold">
                                                            Tarifa confirmed
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No reservado</p>
                                            )}
                                        </div>

                                        {/* Tour */}
                                        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 group">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">🗺️</span>
                                                <h4 className="font-bold text-gray-800">Tour</h4>
                                            </div>
                                            {booking.tour ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold text-gray-700 truncate">{booking.tour.name}</p>
                                                    <p className="text-xs text-gray-500">{booking.tour.location}</p>
                                                    <div className="pt-2 border-t border-purple-100 mt-2">
                                                        <p className="text-xs text-purple-600 font-bold">
                                                            Guía incluido
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No reservado</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Package;
