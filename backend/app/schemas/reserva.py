from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    total_price: float #Precio obligatorio

# =========================
# Schema para RESPUESTA
# Se usa al devolver datos al cliente
# =========================
class BookingResponse(BaseModel):
    """
    Schema para responder reservas
    """
    id: int
    user_id: int
    flight_id: int
    hotel_id: Optional[int]
    tour_id: Optional[int]
    booking_date: datetime
    total_price: float

    model_config = {
        "from_attributes": True
    }
