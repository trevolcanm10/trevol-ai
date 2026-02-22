from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey #Tipos de columnas
from sqlalchemy.orm import relationship #Para definir relaciones entre tablas
from datetime import datetime #Para trabajar con fechas
from .database import Base #Importamos la base de datos

# =========================
# Tabla: Users
# Relación: 1 User -> N Bookings
# =========================
class User(Base):
    __tablename__ = "users" # Nombre de la tabla en la BD

    id = Column(Integer, primary_key=True, index=True) #Primary key
    name = Column(String, nullable=False) #No puede ser nulo
    email = Column(String, nullable=False) #No puede ser nulo
    phone = Column(String, nullable=False) #No puede ser nulo
    created_at = Column(DateTime, default=datetime.now()) #Fecha de creación

    bookings = relationship("Booking", back_populates="user")#Relación con la tabla Bookings
    # Relación 1:N → Un usuario puede tener muchas reservas

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
    origin = Column(String, nullable=False) #Ciudad de origen
    destination = Column(String, nullable=False) #Ciudad de destino
    departure_date = Column(DateTime, nullable=False) #Fecha de salida
    price = Column(Float, nullable=False) #Precio del vuelo
    available_seats = Column(Integer, nullable=False) #Cantidad de asientos disponibles

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
# Tabla: Tours
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

    bookings = relationship("Booking", back_populates="tour")#Relación con la tabla Bookings
    # Relación 0:N → Un tour puede tener muchas reservas


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
    )  # FK opcional → Puede incluir tour o no
    
    booking_date = Column(DateTime, default=datetime.now()) #Fecha de reserva
    # Fecha automática cuando se crea la reserva
    
    total_price = Column(Float, nullable=False) #Precio total de la reserva

    user = relationship("User", back_populates="bookings")#Relación con la tabla Users
    flight = relationship("Flight", back_populates="bookings")#Relación con la tabla Flights
    hotel = relationship("Hotel", back_populates="bookings")#Relación con la tabla Hotels
    tour = relationship("Tour", back_populates="bookings")#Relación con la tabla Tours
