from sqlalchemy.orm import Session  # Para trabajar con sesiones de la base de datos
from app.db import models  # Importamos los modelos
from app.schemas.reserva import BookingCreate  # Importamos el schema de la reserva


# =========================
#  Crear nueva reserva
# =========================
def create_booking(db: Session, booking: BookingCreate):
    """
    Función para crear una nueva reserva, los parámetros son:
    - db: Sesión de la base de datos
    - booking: Datos de la reserva
    """
    db_booking = models.Booking(
        user_id=booking.user_id,
        flight_id=booking.flight_id,
        hotel_id=booking.hotel_id,
        tour_id=booking.tour_id,
        total_price=booking.total_price,
    )

    # Creamos instancia del modelo con datos recibidos
    db.add(db_booking)  # Agregamos la reserva a la base de datos
    db.commit()  # Guardamos los cambios
    db.refresh(db_booking)  # Actualizamos la reserva
    return db_booking  # Retornamos la reserva


# =========================
#  Obtener todas las reservas
# =========================
def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    """
    Función para obtener todas las reservas, los parámetros son:
    - db: Sesión de la base de datos
    - skip: Número de reservas a saltar
    - limit: Número de reservas a obtener
    """
    return (
        db.query(models.Booking).offset(skip).limit(limit).all()
    )  # Obtenemos todas las reservas


# =========================
# Obtener reserva por ID
# =========================
def get_booking(db: Session, booking_id: int):
    """
    Función para obtener una reserva por ID, los parámetros son:
    - db: Sesión de la base de datos
    - booking_id: ID de la reserva
    """
    return (
        db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    )  # Obtenemos la reserva
