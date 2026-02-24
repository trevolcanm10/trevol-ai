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
        )
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .group_by(func.strftime("%Y-%m", models.Booking.booking_date))
        .all()
    )
    return [{"month": month, "revenue": revenue} for month, revenue in results]
