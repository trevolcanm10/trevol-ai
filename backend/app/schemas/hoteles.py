"""
Schemas para hoteles
"""
from pydantic import BaseModel, Field #Para crear schemas

# =========================
#  Schema para CREAR hotel
# Se usa en POST
# =========================
class HotelBase(BaseModel):
    """
    Schema para crear hoteles
    """
    name: str#Nombre
    location: str#Ubicación
    price_per_night: float = Field(gt=0)#Precio por noche
    available_rooms: int = Field(ge=0)#Habitaciones disponibles
class HotelCreate(HotelBase):
    """
    Schema para crear hoteles
    """
    pass
class HotelUpdate(BaseModel):
    """
    Schema para actualizar hoteles
    """
    name: str | None = None #Nombre
    location: str | None = None #Ubicación
    price_per_night: float | None = Field(default=None, gt=0) #Precio por noche
    available_rooms: int | None = Field(default=None, ge=0) #Habitaciones disponibles
    
class HotelResponse(HotelBase):
    """
    Schema para responder hoteles
    """
    id: int

    class Config:
        """
        Configuración del schema
        """
        orm_mode = True
