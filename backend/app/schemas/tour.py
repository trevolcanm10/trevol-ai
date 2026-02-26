"""
Schemas para tours
"""
from pydantic import BaseModel, Field #Para crear schemas

class TourBase(BaseModel):
    """
    Schema para crear tours
    """
    name: str
    location: str
    price: float = Field(gt=0)
    available_slots: int = Field(ge=0)

class TourCreate(TourBase):
    """
    Schema para crear tours
    """
    pass

class TourUpdate(BaseModel):
    """
    Schema para actualizar tours
    """
    name: str | None = None
    location: str | None = None
    price: float | None = Field(default=None, gt=0)
    available_slots: int | None = Field(default=None, ge=0)
    
class TourResponse(TourBase):
    """
    Schema para responder tours
    """
    id: int

    class Config:
        from_attributes = True
        