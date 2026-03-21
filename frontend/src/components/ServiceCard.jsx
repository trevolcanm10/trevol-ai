import React from "react";

export default function ServiceCard({ service, onSelect, isSelected }) {
  if (!service) return null;

  const getCategoryIcon = (category) => {
    const icons = {
      seguro: "fa-shield-halved",
      tramite: "fa-file-invoice",
      traslado: "fa-car-side",
      migratorio: "fa-passport",
      grupo_escolar: "fa-users-rectangle"
    };
    return icons[category] || "fa-cog";
  };

  const getCategoryColor = (category) => {
    const colors = {
      seguro: "blue",
      tramite: "purple",
      traslado: "amber",
      migratorio: "cyan",
      grupo_escolar: "indigo"
    };
    return colors[category] || "gray";
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${isSelected ? 'ring-2 ring-lams-orange' : ''}`}>
      {/* Header del servicio */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <i className={`fa-solid ${getCategoryIcon(service.category)} text-6xl text-gray-400`}></i>
        </div>
        <div className="absolute top-4 left-4">
          <div className={`bg-${getCategoryColor(service.category)}-100 text-${getCategoryColor(service.category)}-600 px-3 py-1 rounded-full text-sm font-semibold`}>
            {service.category}
          </div>
        </div>
      </div>

      {/* Detalles del servicio */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-${getCategoryColor(service.category)}-100 rounded-full flex items-center justify-center`}>
            <i className={`fa-solid ${getCategoryIcon(service.category)} text-${getCategoryColor(service.category)}-600`}></i>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Precio</p>
            <p className="text-2xl font-bold text-lams-orange">S/. {service.price}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onSelect(service)}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              isSelected 
                ? 'bg-lams-navy/10 text-lams-navy cursor-not-allowed' 
                : 'bg-lams-navy hover:bg-lams-navy/90 text-white shadow-lg'
            }`}
          >
            {isSelected ? "Seleccionado" : "Añadir al viaje"}
          </button>
          
          <a 
            href={`https://wa.me/51967010925?text=Hola Lams Viajes! Me interesa el servicio de ${service.name}. Por favor bríndame más información.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg text-center font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i>
            <span>Consultar WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}