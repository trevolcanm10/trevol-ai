"""
Rutas para la busqueda
"""
from fastapi import APIRouter, Depends, Query#Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db.database import get_db#Importamos la sesión de la base de datos
from app.db.models import Flight, Hotel, Tour#Importamos los modelos

router = APIRouter()#Creamos el router
@router.get("/")
def search_travel(
    origin: str | None = Query(None,description="Ciudad de origen del vuelo"),
    destination: str | None = Query(None,description="Ciudad de destino del vuelo"),
    location: str | None = Query(None,description="Ciudad para hoteles y tours"),
    max_price: float | None = Query(None,description="Precio maximo del vuelo"),
    db: Session = Depends(get_db) 
):
    """
    Función para buscar viajes
    """
    flights_query = db.query(Flight) #Consultar para obtener los vuelos
    hotels_query = db.query(Hotel) #Consultar para obtener los hoteles
    tours_query = db.query(Tour) #Consultar para obtener los Tours

    # Filtros para vuelos
    if origin:
        flights_query = flights_query.filter(Flight.origin.ilike(f"%{origin}%"))
        #Filtro para la ciudad de origen
    if destination:
        flights_query = flights_query.filter(Flight.destination.ilike(f"%{destination}%"))
        #Filtro para la ciudad de destino
    #Filtros para hoteles y tours
    if location:
        hotels_query = hotels_query.filter(Hotel.location.ilike(f"%{location}%"))
        #Filtro para la ciudad de destino
        tours_query = tours_query.filter(Tour.location.ilike(f"%{location}%"))
        #Filtro para la ciudad de destino
    if max_price:
        flights_query = flights_query.filter(Flight.price <= max_price)
        #Filtro para el precio maximo
        hotels_query = hotels_query.filter(Hotel.price_per_night <= max_price)
        #Filtro para el precio maximo
        tours_query = tours_query.filter(Tour.price <= max_price)
        #Filtro para el precio maximo
    flights = flights_query.limit(10).all()#Obtenemos los vuelos
    hotels = hotels_query.limit(10).all()#Obtenemos los hoteles
    tours = tours_query.limit(10).all()#Obtenemos los Tours

    return {"flights": flights, "hotels": hotels, "tours": tours}
