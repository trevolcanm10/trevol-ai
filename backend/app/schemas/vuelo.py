"""
    Schemas para vuelos
"""
from datetime import datetime  # Para trabajar con fechas
from pydantic import BaseModel #Para crear schemas


class FlightCreate(BaseModel):
    """
    Schema para crear vuelos
    """
    origin: str
    destination: str
    departure_date: datetime
    price: float
    available_seats: int

class FlightResponse(FlightCreate):
    """
    Schema para responder vuelos
    """
    id: int
    class Config:
        """
        Configuración del schema
        """
        from_attributes = True
