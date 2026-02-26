"""
Rutas para el hotel
"""
from typing import List  # Para trabajar con listas
from fastapi import APIRouter, Depends, HTTPException#Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db.database import get_db#Importamos la sesión de la base de datos
from app.db.models import Hotel #Importamos el modelo de hotel
from app.schemas.hoteles import HotelCreate, HotelResponse, HotelUpdate

# Importamos el schema de hotel
from app.dependencies import require_role#Importamos la dependencia

router = APIRouter(prefix="/hotels", tags=["Hotels"])#Creamos el router

@router.post("/", response_model=HotelResponse)
def create_hotel(
    hotel: HotelCreate,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin"))
):
    """
    Función para crear un hotel
    """
    new_hotel = Hotel(**hotel.dict())
    db.add(new_hotel)
    db.commit()
    db.refresh(new_hotel)
    return new_hotel


@router.get("/", response_model=List[HotelResponse])
def get_hotels(db: Session = Depends(get_db)):
    """
    Función para obtener todos los hoteles
    """
    return db.query(Hotel).all()

@router.get("/{hotel_id}", response_model=HotelResponse)
def get_hotel(hotel_id: int, db: Session = Depends(get_db)):
    """
    Función para obtener un hotel por ID
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")
    return hotel
@router.put("/{hotel_id}", response_model=HotelResponse)
def update_hotel(
  hotel_id: int,
  hotel_update: HotelUpdate,
  db: Session = Depends(get_db),
  _current_user = Depends(require_role("admin"))
):
    """
    Función para actualizar un hotel
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")
    for key, value in hotel_update.dict(exclude_unset=True).items():
        setattr(hotel, key, value)
    db.commit()
    db.refresh(hotel)
    return hotel


@router.delete("/{hotel_id}")
def delete_hotel(hotel_id: int, db: Session = Depends(get_db), _current_user = Depends(require_role("admin"))):
    """
    Función para eliminar un hotel
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")
    db.delete(hotel)
    db.commit()
    return {"message": "Hotel eliminado"}
