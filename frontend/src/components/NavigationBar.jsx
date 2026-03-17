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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span>Travel-AI</span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/')}`}
              >
                Home
              </Link>
              <Link 
                to="/search" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/search')}`}
              >
                {user && (user.role === 'vendedor' || user.role === 'admin') ? 'Gestionar' : 'Buscar'}
              </Link>
              {user && (
                <>
                  {(user.role === 'vendedor' || user.role === 'admin') && (
                    <Link 
                      to="/dashboard" 
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/dashboard')}`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/package" 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/package')}`}
                  >
                    Paquetes
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden md:inline">
                  Hola, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${isActive('/')}`}
          >
            <span className="text-lg">🏠</span>
            Home
          </Link>
          <Link 
            to="/search" 
            className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${isActive('/search')}`}
          >
            <span className="text-lg">
              {user && (user.role === 'vendedor' || user.role === 'admin') ? '⚙️' : '🔍'}
            </span>
            {user && (user.role === 'vendedor' || user.role === 'admin') ? 'Gestionar' : 'Buscar'}
          </Link>
          {user && (
            <>
              {(user.role === 'vendedor' || user.role === 'admin') && (
                <Link 
                  to="/dashboard" 
                  className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${isActive('/dashboard')}`}
                >
                  <span className="text-lg">📊</span>
                  Dashboard
                </Link>
              )}
              <Link 
                to="/package" 
                className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${isActive('/package')}`}
              >
                <span className="text-lg">🧳</span>
                Paquetes
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;