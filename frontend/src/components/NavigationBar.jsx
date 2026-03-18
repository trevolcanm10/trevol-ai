import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';

const NavigationBar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Main Navigation */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group flex items-center space-x-3 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                <span className="text-white text-lg font-black tracking-tighter">T</span>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                Travel-AI
              </span>
            </Link>
            
            <div className="hidden md:ml-12 md:flex md:space-x-10">
              <Link 
                to="/" 
                className={`relative py-2 text-sm font-semibold transition-all duration-300 hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
              >
                Inicio
                {location.pathname === '/' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
              </Link>
              {user && (
                <>
                  {(user.role === 'vendedor' || user.role === 'admin') && (
                    <Link 
                      to="/dashboard" 
                      className={`relative py-2 text-sm font-semibold transition-all duration-300 hover:text-blue-600 ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                      Panel
                      {location.pathname === '/dashboard' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                      )}
                    </Link>
                  )}
                  <Link 
                    to="/mis-viajes" 
                    className={`relative py-2 text-sm font-semibold transition-all duration-300 hover:text-blue-600 ${location.pathname === '/mis-viajes' ? 'text-blue-600' : 'text-gray-600'}`}
                  >
                    Mis Viajes
                    {location.pathname === '/mis-viajes' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Viajero</span>
                  <span className="text-sm font-bold text-gray-800">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shadow-inner">
                  {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-transparent hover:border-red-100 shadow-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Registrarme
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100">
        <div className="flex justify-around py-4">
          <Link 
            to="/" 
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Inicio</span>
          </Link>
          {user && (
            <Link 
              to="/mis-viajes" 
              className={`flex flex-col items-center space-y-1 transition-all duration-300 ${location.pathname === '/mis-viajes' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <span className="text-xl">🧳</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Viajes</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;