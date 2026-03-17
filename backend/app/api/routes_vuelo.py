"""
Rutas para el vuelo
"""
from fastapi import APIRouter, Depends, HTTPException#Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from typing import List#Para trabajar con listas
from app.db.database import get_db#Importamos la sesión de la base de datos
from app.db.models import Flight #Importamos el modelo de vuelo
from app.schemas.vuelo import FlightCreate, FlightResponse, FlightUpdate#Importamos el schema de vuelo
from app.dependencies import require_role#Importamos la dependencia

router = APIRouter(tags=["Flights"])#Creamos el router
@router.post("/", response_model=FlightResponse)#Ruta para crear un vuelo
def create_flight(
    flight: FlightCreate,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin"))
):
    """
    Función para crear un vuelo
    """
    new_flight = Flight(**flight.dict())
    db.add(new_flight)
    db.commit()
    db.refresh(new_flight)
    return new_flight


# Ruta para Listar vuelos (público)
@router.get("/", response_model=List[FlightResponse])
def get_flights(db: Session = Depends(get_db)):
    """
    Función para obtener todos los vuelos
    """
    return db.query(Flight).all()


@router.get("/{flight_id}", response_model=FlightResponse)
def get_flight(flight_id: int, db: Session = Depends(get_db)):
    """
    Función para obtener un vuelo por ID
    """
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight

@router.put("/{flight_id}", response_model=FlightResponse)
def update_flight(
  flight_id: int,
  flight_update: FlightUpdate,
  db: Session = Depends(get_db),
  _current_user = Depends(require_role(["admin", "vendedor"]))
):
    """
    Función para actualizar un vuelo
    """
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    for key, value in flight_update.dict(exclude_unset=True).items():
        setattr(flight, key, value)
    db.commit()
    db.refresh(flight)
    return flight

@router.delete("/{flight_id}")
def delete_flight(flight_id: int, db: Session = Depends(get_db), _current_user = Depends(require_role(["admin", "vendedor"]))):
    """
    Función para eliminar un vuelo
    """
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    db.delete(flight)
    db.commit()
    return {"message": "Flight eliminado"}
