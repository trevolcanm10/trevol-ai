"""
Rutas
"""
from fastapi import FastAPI  # Importamos FastAPI
from fastapi.middleware.cors import CORSMiddleware#Importamos CORS
from app.db.database import engine  # Importamos la base de datos
from app.db.models import Base  # Importamos los modelos
from app.api import routes_reserva  # Importamos las rutas de la reserva
from app.api import routes_dashboard  # Importamos las rutas del dashboard
from app.api import routes_recommendations # Importamos las rutas de las recomendaciones
from app.api import routes_vuelo # Importamos las rutas del vuelo
from app.api import routes_hotel # Importamos las rutas del hotel
from app.api import router_tour # Importamos las rutas del tour
from app.api import routes_cliente # Importamos las rutas del cliente
from app.api import routes_search # Importamos las rutas de la busqueda
from app.api import routes_package # Importamos las rutas del paquete


Base.metadata.create_all(bind=engine)  # Creamos las tablas en la base de datos
app = FastAPI()  # Creamos la app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)#Configuramos CORS
app.include_router(routes_reserva.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(routes_dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(
    routes_recommendations.router,
    prefix="/api/recommendations",
    tags=["Recommendations"],
)
app.include_router(routes_cliente.router, prefix="/api/auth", tags=["Auth"])
app.include_router(routes_vuelo.router, prefix="/api/flights", tags=["Flights"])
app.include_router(routes_hotel.router, prefix="/api/hotels", tags=["Hotels"])
app.include_router(router_tour.router, prefix="/api/tours", tags=["Tours"])
app.include_router(routes_search.router, prefix="/api/search", tags=["Search"])
app.include_router(routes_package.router, prefix="/api/packages", tags=["Travel Packages"])
