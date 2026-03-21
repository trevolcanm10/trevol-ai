"""
Clases que representan las tablas de la base de datos
    
"""
# Standard library
from datetime import datetime
from enum import Enum as PyEnum

# Third-party libraries
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base
from enum import Enum as PyEnum

# Enumeración para los estados de las reservas
class BookingStatus(str, PyEnum):
    """
    Enumeración para los estados de las reservas
    """
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

# =========================
# Tabla: Users
# Relación: 1 User -> N Bookings
# =========================
class User(Base):
    """
    Clase que representa la tabla Users en la base de datos
    """
    __tablename__ = "users" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    name = Column(String, nullable=False) #No puede ser nulo
    email = Column(String, nullable=False) #No puede ser nulo
    phone = Column(String, nullable=False) #No puede ser nulo
    created_at = Column(DateTime, default=datetime.now) #Fecha de creación
    password = Column(String, nullable=False) #No puede ser nulo
    role = Column(String, default="user")#Rol del usuario
    bookings = relationship("Booking", back_populates="user")#Relación con la tabla Bookings
    # Relación 1:N → Un usuario puede tener muchas reservas
    preferences = relationship("UserPreference", backref="user", uselist=False)
    # Relación 1:1 → Un usuario tiene una preferencia

# =========================
# Tabla: Flights
# Relación: 1 Flight -> N Bookings
# =========================
class Flight(Base):
    """
    Clase que representa la tabla Flights en la base de datos
    """
    __tablename__ = "flights" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    #Origen
    origin = Column(String, nullable=False) #Ciudad de origen
    origin_country = Column(String, nullable=True) #País de origen
    #Destino
    destination = Column(String, nullable=False) #Ciudad de destino
    destination_city = Column(String, nullable=True)#Ciudad de destino
    destination_country = Column(String, nullable=True) #País de destino
    #Datos de vuelo
    departure_date = Column(DateTime, nullable=False) #Fecha de salida
    price = Column(Float, nullable=False) #Precio del vuelo
    available_seats = Column(Integer, nullable=False) #Cantidad de asientos disponibles
    #Relaciones
    bookings = relationship("Booking", back_populates="flight")#Relación con la tabla Bookings
    # Relación 1:N → Un vuelo puede tener muchas reservas

# =========================
# Tabla: Hotels
# Relación: 0:N con Bookings
# (Puede no tener reservas)
# =========================
class Hotel(Base):
    """
    Clase que representa la tabla Hotels en la base de datos
    """
    __tablename__ = "hotels" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    name = Column(String, nullable=False) #Nombre del hotel
    location = Column(String, nullable=False) #Ciudad del hotel
    price_per_night = Column(Float, nullable=False) #Precio por noche
    available_rooms = Column(Integer, nullable=False) #Cantidad de habitaciones disponibles

    bookings = relationship("Booking", back_populates="hotel")#Relación con la tabla Bookings
    # Relación 0:N → Un hotel puede tener muchas reservas

# =========================
# Tabla: Tours (Solo tours turísticos)
# Relación: 0:N con Bookings
# =========================
class Tour(Base):
    """
    Clase que representa la tabla Tours en la base de datos
    """
    __tablename__ = "tours" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    name = Column(String, nullable=False) #Nombre del tour
    location = Column(String, nullable=False) #Ciudad del tour
    price = Column(Float, nullable=False) #Precio del tour
    available_slots = Column(Integer, nullable=False) #Cantidad de asientos disponibles
    duration_hours = Column(Integer, nullable=True) #Duración del tour en horas
    difficulty_level = Column(String, default="easy") #Nivel de dificultad

    bookings = relationship("Booking", back_populates="tour")#Relación con la tabla Bookings
    # Relación 0:N → Un tour puede tener muchas reservas

# =========================
# Tabla: Services (Servicios adicionales)
# Relación: N:M con Bookings
# =========================
class Service(Base):
    """
    Clase que representa la tabla Services en la base de datos
    """
    __tablename__ = "services" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    name = Column(String, nullable=False) #Nombre del servicio
    category = Column(String, nullable=False) #Categoría: seguro, tramite, traslado, migratorio, grupo_escolar
    price = Column(Float, nullable=False) #Precio del servicio
    description = Column(String, nullable=True) #Descripción del servicio
    is_subscription = Column(Boolean, default=False) #Si es servicio recurrente
    location_required = Column(Boolean, default=False) #Si necesita ubicación

    bookings = relationship("BookingService", back_populates="service")#Relación con la tabla BookingServices
    # Relación N:M → Un servicio puede estar en muchas reservas

# =========================
# Tabla: BookingServices (Relación muchos a muchos)
# =========================
class BookingService(Base):
    """
    Clase que representa la tabla BookingServices en la base de datos
    """
    __tablename__ = "booking_services" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    booking_id = Column(Integer, ForeignKey("bookings.id")) #FK a bookings
    service_id = Column(Integer, ForeignKey("services.id")) #FK a services
    quantity = Column(Integer, default=1) #Cantidad del servicio

    # Relaciones
    booking = relationship("Booking", back_populates="services")
    service = relationship("Service", back_populates="bookings")

# =====================================================
# Tabla de preferencias del usuario (Aprendizaje)
# =====================================================
class UserPreference(Base):
    """
    Clase que representa la tabla UserPreferences en la base de datos
    """
    __tablename__ = "user_preferences" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    #FK obligatoria → Toda preferencia pertenece a un usuario
    history_weight = Column(Float, default=0.5)  # Peso del historial
    popularity_weight = Column(Float, default=0.3)  # Peso de la popularidad
    price_weight = Column(Float, default=0.2)  # Peso del precio
    learning_rate = Column(Float, default=0.05)#Tasa de aprendizaje


# =========================
# Tabla: Bookings
# Entidad central del sistema
# =========================
class Booking(Base):
    """
    Clase que representa la tabla Bookings en la base de datos
    """
    __tablename__ = "bookings" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    user_id = Column(
        Integer, ForeignKey("users.id")
    )  # FK obligatoria → Toda reserva pertenece a un usuario
    flight_id = Column(
        Integer, ForeignKey("flights.id")
    )  # FK obligatoria → Toda reserva debe tener un vuelo

    hotel_id = Column(
        Integer, ForeignKey("hotels.id")
    )  # FK opcional → Puede incluir hotel o no
    tour_id = Column(
        Integer, ForeignKey("tours.id")
    )  # FK opcional → Puede incluir tour turístico o no
    booking_date = Column(DateTime, default=datetime.now)
    # Fecha automática cuando se crea la reserva
    total_price = Column(Float, nullable=False) #Precio total de la reserva

    user = relationship("User", back_populates="bookings")#Relación con la tabla Users
    flight = relationship("Flight", back_populates="bookings")#Relación con la tabla Flights
    hotel = relationship("Hotel", back_populates="bookings")#Relación con la tabla Hotels
    tour = relationship("Tour", back_populates="bookings")#Relación con la tabla Tours
    services = relationship("BookingService", back_populates="booking")#Relación con la tabla BookingServices
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    #Estado de la reserva