"""
Rutas para el dashboard
"""
from fastapi import APIRouter, Depends#Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db.database import get_db#Importamos la sesión de la base de datos
from app.services import dashboard_service#Importamos el servicio del dashboard

router = APIRouter()#Creamos el router


@router.get("/revenue")#Ruta para obtener el total de ingresos
def total_revenue(db: Session = Depends(get_db)):
    """
    Función para obtener el total de ingresos confirmados
    """
    return {"total_revenue": dashboard_service.get_total_revenue(db)}


@router.get("/bookings")#Ruta para obtener el total de reservas
def total_bookings(db: Session = Depends(get_db)):
    """
    Función para obtener el total de reservas confirmadas
    """
    return {"total_bookings": dashboard_service.get_total_bookings(db)}


@router.get("/top-destinations")#Ruta para obtener las destinos mas populares
def top_destinations(db: Session = Depends(get_db)):
    """
    Función para obtener los destinos mas vendidos
    """
    return dashboard_service.get_top_destinations(db)


@router.get("/monthly-revenue")
def monthly_revenue(db: Session = Depends(get_db)):
    """
    Función para obtener los ingresos por mes
    """
    return dashboard_service.get_monthly_revenue(db)
