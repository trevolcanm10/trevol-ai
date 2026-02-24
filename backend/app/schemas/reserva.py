from pydantic import BaseModel#Para crear schemas
from typing import Optional#Para campos opcionales
from datetime import datetime#Para trabajar con fechas
from enum import Enum #Para trabajar con estados
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
    tour_id: Optional[int] = None   #Tour opcional

# =========================
#  Schema para CREAR reserva
# Se usa en POST
# =========================
class BookingCreate(BookingBase):
    """
    Schema para crear reservas
    """
    user_id: int #Usuario obligatorio

#===============================
# Schema para ACTUALIZAR reserva
#===============================
class BookingStatus(str, Enum):
    """
    Estados de la reserva
    """
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


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
    booking_date: datetime#Fecha
    total_price: float#Precio
    status: BookingStatus#Estados
    model_config = {
        "from_attributes": True
    }#Atributos
