"""
Schemas para servicios
"""
from pydantic import BaseModel, Field #Para crear schemas
from typing import Optional #Para campos opcionales

class ServiceBase(BaseModel):
    """
    Schema base para servicios
    """
    name: str
    category: str  # seguro, tramite, traslado, migratorio, grupo_escolar
    price: float = Field(...,gt=0)
    description: Optional[str] = None
    is_subscription: Optional[bool] = False
    location_required: Optional[bool] = False

class ServiceCreate(ServiceBase):
    """
    Schema para crear servicios
    """
    pass

class ServiceUpdate(BaseModel):
    """
    Schema para actualizar servicios
    """
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    description: Optional[str] = None
    is_subscription: Optional[bool] = None
    location_required: Optional[bool] = None

class ServiceResponse(ServiceBase):
    """
    Schema para responder servicios
    """
    id: int

    class Config:
        from_attributes = True