import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-2 rounded-lg">
                <i className="fa-solid fa-plane-departure text-xl"></i>
              </span>
              <span className="text-2xl font-bold text-white tracking-tight">Travel-AI</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 font-light">
              Redefiniendo el turismo global con el poder de la Inteligencia Artificial. Tu próximo destino está a solo un clic de distancia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full text-gray-400 hover:bg-sky-400 hover:text-white transition-all duration-300">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest border-l-4 border-cyan-400 pl-4">Navegación</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group">
                <i className="fa-solid fa-chevron-right text-[10px] mr-2 opacity-0 group-hover:opacity-100 transition-all"></i> Home
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group">
                <i className="fa-solid fa-chevron-right text-[10px] mr-2 opacity-0 group-hover:opacity-100 transition-all"></i> Paquetes AI
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group">
                <i className="fa-solid fa-chevron-right text-[10px] mr-2 opacity-0 group-hover:opacity-100 transition-all"></i> Nuestros Destinos
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group">
                <i className="fa-solid fa-chevron-right text-[10px] mr-2 opacity-0 group-hover:opacity-100 transition-all"></i> Sobre Nosotros
              </a></li>
            </ul>
          </div>

          {/* Destinos Populares */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest border-l-4 border-blue-500 pl-4">Top Destinos</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Cusco, Perú</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Arequipa, Perú</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Lima, Perú</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Cancún, México</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest border-l-4 border-purple-500 pl-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Recibe las mejores ofertas impulsadas por IA directamente en tu buzón.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm italic">
          <p>© 2024 Travel-AI. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
