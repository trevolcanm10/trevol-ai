"""
Schemas para la reserva
"""
# =========================
#  Importaciones principales
# =========================
from pydantic import BaseModel, Field#Para crear schemas
from typing import Optional, List#Para campos opcionales
from datetime import datetime#Para trabajar con fechas
from enum import Enum #Para trabajar con estados
from app.schemas.cliente import ClienteResponse
# =========================
#  Importaciones secundarias
# =========================
from app.schemas.vuelo import FlightResponse#Vuelo
from app.schemas.hoteles import HotelResponse#Hotel
from app.schemas.tour import TourResponse#Tour
from app.schemas.service import ServiceResponse#Service

# =========================
# Enumeración para los estados de las reservas
# =========================
class BookingStatus(str, Enum):
    """
    Enumeración para los estados de las reservas
    """
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

# =========================
#  Schema Base
# Contiene campos comunes
# =========================
class BookingBase(BaseModel):
    """
    Schema base para reservas
    """
    flight_id: int  # Vuelo obligatorio
    hotel_id: Optional[int] = None #hotel opcional
    tour_id: Optional[int] = None   #Tour turístico opcional

# =========================
#  Schema para CREAR reserva
# Se usa en POST
# =========================
class BookingCreate(BookingBase):
    """
    Schema para crear reservas
    """
    service_ids: List[int] = Field(default_factory=list)  # Servicios adicionales (N:M)

class BookingServiceResponse(BaseModel):
    """
    Schema para responder servicios
    """
    service:ServiceResponse
    class Config:
        """
        Configuración del schema
        """
        from_attributes = True
# =========================
# Schema para RESPUESTA
# Se usa al devolver datos al cliente
# =========================
class BookingResponse(BaseModel):
    """
    Schema para responder reservas
    """
    id: int#ID
    user_id: int#Usuario
    flight_id: int#Vuelo
    hotel_id: Optional[int]#Hotel
    tour_id: Optional[int]#Tour
    service_ids: Optional[List[int]] = None  # Servicios
    booking_date: datetime#Fecha
    total_price: float#Precio
    status: BookingStatus#Estados
    user: Optional[ClienteResponse] = None
    flight: Optional[FlightResponse] = None
    hotel: Optional[HotelResponse] = None
    tour: Optional[TourResponse] = None
    services: Optional[List[BookingServiceResponse]] = None

    class Config:
        """
        Configuración del schema
        """
        from_attributes = True
        use_enum_values = True
