from sqlalchemy.orm import Session  # Para trabajar con sesiones de la base de datos
from fastapi import HTTPException, status  # Dependencias de FastAPI
from app.db import models  # Importamos los modelos
from app.schemas.reserva import BookingCreate  # Importamos el schema de la reserva
from app.services import recommendation_service #Importamos el servicio de las recomendaciones

def create_booking_service(db: Session, booking_data: BookingCreate):
    """
    Función para crear una nueva reserva
    - db: Sesión de la base de datos
    - booking_data: Datos de la reserva
    - return: La reserva creada
    """
    # Verificar usuario
    user = db.query(models.User).filter(models.User.id == booking_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    # Verificar vuelo
    flight = (
        db.query(models.Flight)
        .filter(models.Flight.id == booking_data.flight_id)
        .first()
    )
    if not flight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found"
        )
    # Verificar disponibilidad
    if flight.available_seats <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No seats available"
        )
    total_price = flight.price  # Precio base obligatorio
    # Hotel opcional
    hotel = None
    if booking_data.hotel_id:
        hotel = (
            db.query(models.Hotel)
            .filter(models.Hotel.id == booking_data.hotel_id)
            .first()
        )
        if not hotel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found"
            )
        total_price += hotel.price_per_night
    # Tour opcional
    tour = None
    if booking_data.tour_id:
        tour = (
            db.query(models.Tour).filter(models.Tour.id == booking_data.tour_id).first()
        )
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found"
            )
        total_price += tour.price
    # Descontar asiento del vuelo
    flight.available_seats -= 1
    # Crear reserva
    new_booking = models.Booking(
        user_id=booking_data.user_id,
        flight_id=booking_data.flight_id,
        hotel_id=booking_data.hotel_id,
        tour_id=booking_data.tour_id,
        total_price=total_price,
        status=models.BookingStatus.CONFIRMED
    )
    db.add(new_booking)  # Agregamos la reserva
    db.commit()  # Guardamos los cambios
    db.refresh(new_booking)  # Actualizamos la reserva}

    # ------------------------------------------------
    # ACTIVAR APRENDIZAJE AUTOMÁTICO
    # ------------------------------------------------
    recommendation_service.update_user_preferences(
        user_id=new_booking.user_id,
        destination=flight.destination,
        db=db,
    )
    return new_booking

def cancel_booking_service(db: Session, booking_id: int):
    """
    Función para cancelar una reserva
    - db: Sesión de la base de datos
    - booking_id: ID de la reserva
    """
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    if booking.status == models.BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Booking already cancelled"
        )
    #Devolver asiento del vuelo
    flight = db.query(models.Flight).filter(models.Flight.id == booking.flight_id).first() #Obtenemos el vuelo
    flight.available_seats += 1 #Aumentamos el asiento
    #Cambiar estado
    booking.status = models.BookingStatus.CANCELLED
    db.commit()
    db.refresh(booking)
    return booking
