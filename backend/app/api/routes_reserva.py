"""
Rutas para la reserva
"""
from app.dependencies import get_current_user#Importamos la dependencia
from app.db import models#Importamos los modelos
from app.db.models import User #Importamos el modelo de usuario
from fastapi import APIRouter, Depends, HTTPException, status #Dependencias de FastAPI
from sqlalchemy.orm import Session #Para trabajar con sesiones de la base de datos
from app.db.database import get_db #Importamos la sesión de la base de datos
from app.schemas.reserva import BookingCreate, BookingResponse #Importamos el schema de la reserva
from app.crud import reserva as crud_reserva #Importamos el crud de la reserva
from app.services import reserva_service  # Importamos el servicio de la reserva
from sqlalchemy.orm import joinedload #Para cargar relaciones
router = APIRouter() #Creamos el router


# =========================
# Crear reserva
# POST /api/bookings
# =========================
@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Función para crear una nueva reserva
    - booking: Datos de la reserva
    - db: Sesión de la base de datos
    - return: La reserva creada
    """
    return reserva_service.create_booking_service(db, booking,current_user.id) #Retornamos la reserva creada_


# =========================
# Obtener todas las reservas
# GET /api/bookings
# =========================
@router.get("/", response_model=list[BookingResponse])
def read_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Función para obtener todas las reservas
    - skip: Número de reservas a saltar
    - limit: Número de reservas a obtener
    - db: Sesión de la base de datos
    - return: Todas las reservas
    """
    bookings = db.query(models.Booking).options(
        joinedload(models.Booking.flight),
        joinedload(models.Booking.hotel),
        joinedload(models.Booking.tour),
        joinedload(models.Booking.user)
    ).offset(skip).limit(limit).all()
    
    for booking in bookings:
        booking.user_name = booking.user.name if booking.user else None
        
    return bookings

# =========================
# Obtener reservas del usuario actual
# GET /api/bookings/me
# =========================
@router.get("/me", response_model=list[BookingResponse])
def read_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Función para obtener las reservas del usuario autenticado
    """
    bookings = db.query(models.Booking).options(
        joinedload(models.Booking.flight),
        joinedload(models.Booking.hotel),
        joinedload(models.Booking.tour),
        joinedload(models.Booking.user)
    ).filter(models.Booking.user_id == current_user.id).all()
    
    for booking in bookings:
        booking.user_name = booking.user.name if booking.user else None
        
    return bookings

# =========================
# Obtener reserva por ID
# GET /api/bookings/{booking_id}
# =========================
@router.get("/{booking_id}", response_model=BookingResponse)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    Función para obtener una reserva por ID
    - booking_id: ID de la reserva
    - db: Sesión de la base de datos
    - return: La reserva obtenida
    """
    booking = db.query(models.Booking).options(
        joinedload(models.Booking.flight),
        joinedload(models.Booking.hotel),
        joinedload(models.Booking.tour),
        joinedload(models.Booking.user)
    ).filter(models.Booking.id == booking_id).first()
    
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    
    booking.user_name = booking.user.name if booking.user else None
    return booking
# =========================
# Cancelar reserva
# PUT /api/bookings/{booking_id}/cancel
# =========================
@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    Función para cancelar una reserva
    - booking_id: ID de la reserva
    - db: Sesión de la base de datos
    - return: La reserva cancelada
    """
    return reserva_service.cancel_booking_service(db, booking_id)
