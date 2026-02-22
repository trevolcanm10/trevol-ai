from fastapi import FastAPI #Importamos FastAPI
from app.db.database import engine #Importamos la base de datos
from app.db.models import Base #Importamos los modelos
from app.api import routes_reserva #Importamos las rutas de la reserva

Base.metadata.create_all(bind=engine) #Creamos las tablas en la base de datos

app = FastAPI() #Creamos la app


app.include_router(
    routes_reserva.router,
    prefix="/api/bookings",
    tags=["Bookings"]
)