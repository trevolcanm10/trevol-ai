"""
Servicio para obtener recomendaciones personalizadas
"""
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from sqlalchemy import func#Para trabajar con funciones de la base de datos
from app.db import models#Importamos los modelos

# =====================================================
#  Obtener recomendaciones personalizadas (Motor Híbrido)
# =====================================================
def get_user_recommendations(user_id: int, db: Session):
    """
    Función para obtener recomendaciones personalizadas
    - user_id: ID del usuario
    - db: Sesión de la base de datos
    """
    # ---------------------------------------------
    # Popularidad global por destino
    # ---------------------------------------------
    global_popularity = (
        db.query(
            models.Flight.destination,
            func.count(models.Booking.id).label("total_sales"),
        )  # Obtenemos el destino y la cantidad total de reservas
        .join(models.Booking, models.Booking.flight_id == models.Flight.id)
        .filter(models.Booking.status == models.BookingStatus.CONFIRMED)
        .group_by(models.Flight.destination)
        .all()
    )#Obtenemos 5 destinos

    popularity_dict = {
        destination: total_sales for destination, total_sales in global_popularity
    }  # Convertimos a diccionario para acceso rápido
    # ---------------------------------------------
    # Historial del usuario
    # ---------------------------------------------
    user_history = (
        db.query(
            models.Flight.destination,
            func.count(models.Booking.id).label("user_total"),
        )  # Obtenemos destino y cantidad reservada por el usuario
        .join(models.Booking, models.Booking.flight_id == models.Flight.id)
        .filter(
            models.Booking.user_id == user_id,
            models.Booking.status == models.BookingStatus.CONFIRMED,
        )
        .group_by(models.Flight.destination)
        .all()
    )#Obtenemos 5 destinos

    user_dict = {destination: user_total for destination, user_total in user_history}  # Convertimos a diccionario para acceso rápido

    # ---------------------------------------------
    # Precio promedio por destino
    # ---------------------------------------------
    price_data = (
        db.query(
            models.Flight.destination,
            func.avg(models.Flight.price).label("avg_price"),#Obtenemos precio promedio
        )  # Obtenemos precio promedio por destino
        .group_by(models.Flight.destination)
        .all()
    )

    price_dict = {destination: avg_price for destination, avg_price in price_data}

    # ---------------------------------------------
    # Si no hay datos globales → fallback
    # ---------------------------------------------
    if not popularity_dict:
        return {"message": "No data available for recommendations."}
    # ---------------------------------------------
    # Calcular score híbrido
    # Fórmula:
    # Score = (HistorialUsuario * 0.5)
    #       + (PopularidadGlobal * 0.3)
    #       + (FactorPrecio * 0.2)
    # ---------------------------------------------
    scores = []

    for destination in popularity_dict.keys():

        user_score = user_dict.get(destination, 0)  # Historial del usuario
        global_score = popularity_dict.get(destination, 0)  # Popularidad global
        avg_price = price_dict.get(destination, 1)  # Precio promedio

        price_factor = (
            1 / avg_price if avg_price else 0
        )  # Destinos más baratos mejoran score

        score = (user_score * 0.5) + (global_score * 0.3) + (price_factor * 0.2)

        scores.append((destination, score))

    # ---------------------------------------------
    # Ordenar por score descendente
    # ---------------------------------------------
    scores.sort(key=lambda x: x[1], reverse=True)

    favorite_destination = scores[0][0]  # Tomamos el mejor destino
    # ---------------------------------------------
    # Recomendar vuelos del mejor destino
    # ---------------------------------------------
    recommended_flights = (
        db.query(models.Flight)
        .filter(models.Flight.destination == favorite_destination)
        .limit(5)
        .all()
    )#Obtenemos 5 vuelos
    # ---------------------------------------------
    # Recomendar hoteles del mejor destino
    # ---------------------------------------------
    recommended_hotels = (
        db.query(models.Hotel)
        .filter(models.Hotel.location == favorite_destination)
        .limit(5)
        .all()
    )#Obtenemos 5 hoteles
    # ---------------------------------------------
    #   Recomendar tours del mejor destino
    # ---------------------------------------------
    recommended_tours = db.query(models.Tour)\
        .filter(models.Tour.location == favorite_destination)\
        .limit(5)\
        .all()#Obtenemos 5 tours

    return {
        "recommended_destination": favorite_destination,
        "score": scores[0][1],
        "flights": recommended_flights,
        "hotels": recommended_hotels,
        "tours": recommended_tours,
    }  # Retornamos la recomendación
