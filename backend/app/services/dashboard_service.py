from sqlalchemy.orm import Session  # Para trabajar con sesiones de la base de datos
from sqlalchemy import func  # Para trabajar con funciones de la base de datos
from app.db import models  # Importamos los modelos

# ========================
# Total de ingresos confirmados
# ========================
def get_total_revenue(db: Session):
    """
    Función para obtener el total de ingresos confirmados, los parámetros son:
    - db: Sesión de la base de datos
    """
    total = (
        db.query(func.sum(models.Booking.total_price))
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .scalar()
    )
    return total or 0.0# Si no hay ingresos confirmados, retornamos 0

# ========================
# Total de reservas confirmadas
# ========================
def get_total_bookings(db: Session):
    """
    Función para obtener el total de reservas confirmadas, los parámetros son:
    - db: Sesión de la base de datos
    """
    count = (
        db.query(func.count(models.Booking.id))
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .scalar()
    )
    return count

# ========================
# Destinos más vendidos
# ========================
def get_top_destinations(db: Session):
    """
    Función para obtener los destinos más vendidos, los parámetros son:
    - db: Sesión de la base de datos
    """
    results = (
        db.query(
            models.Flight.destination,
            func.count(models.Booking.id).label("total_sales"),
        )
        .join(models.Booking, models.Booking.flight_id == models.Flight.id)
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .group_by(models.Flight.destination)
        .order_by(func.count(models.Booking.id).desc())
        .all()
    )
    return [
        {"destination": destination, "total_sales": total}
        for destination, total in results
    ]

# ===================
# Ingresos por mes
# ===================
def get_monthly_revenue(db: Session):
    """
    Función para obtener los ingresos por mes, los parámetros son:
    - db: Sesión de la base de datos
    """
    results = (
        db.query(
            func.strftime("%Y-%m", models.Booking.booking_date).label("month"),
            func.sum(models.Booking.total_price).label("revenue"),
            func.count(models.Booking.id).label("bookings_count"),
        )
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .group_by(func.strftime("%Y-%m", models.Booking.booking_date))
        .all()
    )
    return [{"month": month, "revenue": revenue, "bookingsCount": count} for month, revenue, count in results]

# ===================
# Reservas recientes
# ===================
def get_recent_bookings(db: Session, limit: int = 5):
    """
    Función para obtener las reservas recientes, los parámetros son:
    - db: Sesión de la base de datos
    - limit: Número de reservas a obtener
    """
    results = (
        db.query(
            models.Booking.id,
            models.Booking.booking_date,
            models.Booking.total_price,
            models.Flight.destination,
            models.User.name.label("user_name")
        )
        .join(models.Flight, models.Booking.flight_id == models.Flight.id)
        .join(models.User, models.Booking.user_id == models.User.id)
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .order_by(models.Booking.booking_date.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": booking_id,
            "booking_date": booking_date,
            "total_price": total_price,
            "destination": destination,
            "user_name": user_name
        }
        for booking_id, booking_date, total_price, destination, user_name in results
    ]
# ===================
# Obtener clientes
# ===================
def get_customers(db: Session):
    """
    Función para obtener todos los usuarios con rol 'cliente' o sin rol específico
    """
    results = db.query(
        models.User.name,
        models.User.email,
        models.User.phone,
        models.User.created_at
    ).filter(
        (models.User.role != 'admin')
    ).order_by(models.User.created_at.desc()).all()
    
    return [
        {
            "name": name,
            "email": email,
            "phone": phone,
            "created_at": created_at
        }
        for name, email, phone, created_at in results
    ]
