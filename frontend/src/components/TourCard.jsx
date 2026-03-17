import React from "react";

export default function TourCard({ tour, onSelect, onCancel, isSelected }) {
  if (!tour) return null;

  // Generate tour destination image based on tour name
  const getTourImage = (tourName) => {
    const tourImages = {
      "Rockefeller Center":
        "https://images.ctfassets.net/1aemqu6a6t65/2CA16quTK3q6aLY5I2QNlz/191110b2aa108e5f83751e397da096fa/holiday_3000x2000",
      "Saint Patrick’s Cathedral":
        "https://travel.usnews.com/dims4/USNEWS/c8fa877/2147483647/resize/976x652%5E%3E/crop/976x652/quality/85/format/webp/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FSt_Patricks_Cathedral_Gabriel_Pevida_GEtty.jpg",
      "Central Park Carousel":
        "https://scontent.flim29-1.fna.fbcdn.net/v/t39.30808-6/245928753_140777234948531_2239864642245366036_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeH3qaD64LMwToDI0ZqPXqnoGMtuI6et4FkYy24jp63gWZOW3iGMMyX4MArGIhZpln3aoirxcVAm4COrU0ZWedkW&_nc_ohc=vu-vsHG6rfAQ7kNvwHhSsiy&_nc_oc=Adk5Gb8U6gL8-nlLcKcRNqD5vZvqNOqviCi8pmFLobKRGGMAQBDPCqq4Gxb_Lumlcg7tQmtnG2P_kF-eLAlW5_5G&_nc_zt=23&_nc_ht=scontent.flim29-1.fna&_nc_gid=zccipeJi16Ac1RBAQ8Fi0Q&_nc_ss=8&oh=00_AfxlzBlwM5Q-Mm2qImfUm6cjXsTepkvbI95WiLIoQla0tA&oe=69BE81E1",
      "Top of the Rock":
        "https://images.unsplash.com/photo-1505765050503-5ef84c10c727?q=80&w=1000",
      "Columbus Circle":
        "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab?q=80&w=1000",
      "Times Square":
        "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab?q=80&w=1000",
      "New York":
        "https://media.istockphoto.com/id/1454217037/es/foto/estatua-de-la-libertad-y-horizonte-de-la-ciudad-de-nueva-york-con-el-distrito-financiero-de.jpg?s=612x612&w=0&k=20&c=1abPeg82iwNr0XbPc9eormGet3axsUdkaWgnXSM8e9g=",
    };
    return tourImages[tourName] || `https://source.unsplash.com/featured/400x300/?tour,${tourName.toLowerCase()}`;
  };

  const tourImage = getTourImage(tour.name);

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
      {/* Tour Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tourImage} 
          alt={`${tour.name} - ${tour.location}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-gray-900">{tour.type}</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{tour.name}</h3>
          <p className="text-sm opacity-90">{tour.location}</p>
        </div>
      </div>

      {/* Tour Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-map-marked-alt text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tour</p>
              <p className="text-xs text-gray-400">Ubicación: {tour.location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tipo de tour</p>
            <p className="text-sm font-medium capitalize">{tour.type}</p>
          </div>
        </div>

        {/* Price and Availability */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Precio del tour</span>
            <span className="text-2xl font-bold text-purple-600">S/. {tour.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Disponibilidad</span>
            <span className="text-sm font-semibold text-gray-700">{tour.available_slots} slots</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tipo de experiencia</p>
            <p className="text-lg font-semibold capitalize">{tour.type}</p>
          </div>
          {isSelected ? (
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <i className="fa-solid fa-times"></i>
              <span>Quitar Tour</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(tour)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Añadir al viaje</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
