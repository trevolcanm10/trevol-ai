"""
Rutas para el paquete
"""
from sqlalchemy import or_#Para realizar búsquedas en múltiples campos simultáneamente
from fastapi import APIRouter, Depends, Query, HTTPException #Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db.database import get_db#Importamos la sesión de la base de datos
from app.db.models import Flight, Hotel, Tour #Importamos los modelos

router = APIRouter()#Creamos el router
@router.get("/")
def build_travel_package(
    origin: str = Query(...,description="Ciudad de origen del vuelo"),
    destination: str = Query(...,description="Ciudad de destino del vuelo"),
    db: Session = Depends(get_db)#Dependencia de la base de datos
):
    """
    Función para buscar viajes
    """
    flight = (
        db.query(Flight)
        .filter(
            or_(
                Flight.origin.ilike(f"%{origin}%"),
                Flight.origin_country.ilike(f"%{origin}%"),
            ),
            or_(
                Flight.destination.ilike(f"%{destination}%"),
                Flight.destination_city.ilike(f"%{destination}%"),
                Flight.destination_country.ilike(f"%{destination}%"),
            ),
            Flight.available_seats > 0,
        )
        .order_by(Flight.price.asc())
        .first()
    )
    city = None
    if flight:
        city = flight.destination_city or flight.destination
    hotel = (
        db.query(Hotel)  # Buscar el hotel en el destino
        .filter(
            (
                Hotel.location.ilike(f"%{city}%")
                if city
                else Hotel.location.ilike(f"%{destination}%")
            ),
            Hotel.available_rooms > 0,  # Verificar disponibilidad
        )
        .order_by(Hotel.price_per_night.asc())  # Ordenar por precio ascendente
        .first()  # Obtener el primero
    )
    tour = (
        db.query(Tour)  # Buscar tour en el destino
        .filter(
            (
                Tour.location.ilike(f"%{city}%")
                if city
                else Tour.location.ilike(f"%{destination}%")
            ),
            Tour.available_slots > 0,  # Verificar disponibilidad
        )
        .order_by(Tour.price.asc())  # Ordenar por precio ascendente
        .first()  # Obtener el primero
    )
    if not flight and not hotel and not tour:
        raise HTTPException(status_code=404, detail="No se encontraron opciones")
    total_price = 0
    if flight:
        total_price += flight.price
    if hotel:
        total_price += hotel.price_per_night
    if tour:
        total_price += tour.price
    return {
        "origin": origin,
        "destination": destination,
        "flight": flight,
        "hotel": hotel,
        "tour": tour,
        "total_price": total_price
    }
