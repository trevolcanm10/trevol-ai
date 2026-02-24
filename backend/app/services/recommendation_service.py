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

        preference = (
            db.query(models.UserPreference)
            .filter(models.UserPreference.user_id == user_id)
            .first()
        )

        if not preference:
            history_w = 0.5
            popularity_w = 0.3
            price_w = 0.2
        else:
            history_w = preference.history_weight
            popularity_w = preference.popularity_weight
            price_w = preference.price_weight

        score = (
            (user_score * history_w)
            + (global_score * popularity_w)
            + (price_factor * price_w)
        )        
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
# =====================================
# Actualizar preferencias del usuario
# =====================================
def update_user_preferences(user_id: int, destination: str, db: Session):
    """
    Función para actualizar preferencias del usuario
    """
    preference = (
        db.query(models.UserPreference)
        .filter(models.UserPreference.user_id == user_id)
        .first()
    )

    if not preference:
        preference = models.UserPreference(user_id=user_id)
        db.add(preference)# Agregamos la preferencia a la base de datos
        db.commit()# Guardamos los cambios
        db.refresh(preference)# Actualizamos la preferencia

    # Si el usuario vuelve a reservar mismo destino → reforzar historial
    preference.history_weight += preference.learning_rate
    preference.popularity_weight -= preference.learning_rate / 2
    preference.price_weight -= preference.learning_rate / 2

    # Normalizar para que sumen 1
    total = (
        preference.history_weight
        + preference.popularity_weight
        + preference.price_weight
    )

    preference.history_weight /= total
    preference.popularity_weight /= total
    preference.price_weight /= total

    db.commit()# Guardamos los cambios
