from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db import models#Importamos los modelos
from app.db.database import SessionLocal,engine#Importamos la base de datos
from datetime import datetime,timedelta #Para trabajar con fechas
import random #Para generar datos aleatorios

# Crear todas las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# Crear una sesión de la base de datos
db = SessionLocal()

# ------------------------
# 1️⃣ Crear usuarios
# ------------------------
users_data = [
    {
        "name": "Admin User",
        "email": "admin@travel.com",
        "phone": "999999999",
        "password": "admin123",
        "role": "admin",
    }
]

# 2 usuarios normales + 12 más ficticios
for i in range(1, 15):
    users_data.append(
        {
            "name": f"User{i}",
            "email": f"user{i}@mail.com",
            "phone": f"9000000{i:03}",
            "password": "user123",
            "role": "user",
        }
    )

users = []
for u in users_data:
    user = models.User(**u)
    db.add(user)
    db.commit()
    db.refresh(user)
    users.append(user)

print("✅ Usuarios creados")
# ------------------------
# 2️⃣ Crear vuelos
# ------------------------
cities = [
    "Madrid",
    "Paris",
    "London",
    "New York",
    "Tokyo",
    "Sydney",
    "Berlin",
    "Dubai",
    "Rome",
    "Toronto",
    "Beijing",
    "Moscow",
    "Istanbul",
    "Bangkok",
    "Seoul",
]

flights = []
for i in range(15):
    flight = models.Flight(
        origin=random.choice(cities),
        destination=random.choice(cities),
        departure_date=datetime.now() + timedelta(days=random.randint(1, 60)),
        price=random.randint(100, 1000),
        available_seats=random.randint(10, 200),
    )
    db.add(flight)
    db.commit()
    db.refresh(flight)
    flights.append(flight)

print("✅ Vuelos creados")

# ------------------------
# 3️⃣ Crear hoteles
# ------------------------
hotels = []
for i in range(15):
    hotel = models.Hotel(
        name=f"Hotel{i+1}",
        location=random.choice(cities),
        price_per_night=random.randint(50, 500),
        available_rooms=random.randint(5, 100),
    )
    db.add(hotel)
    db.commit()
    db.refresh(hotel)
    hotels.append(hotel)

print("✅ Hoteles creados")

# ------------------------
# 4️⃣ Crear tours
# ------------------------
tours = []
for i in range(15):
    tour = models.Tour(
        name=f"Tour{i+1}",
        location=random.choice(cities),
        price=random.randint(30, 300),
        available_slots=random.randint(5, 50),
    )
    db.add(tour)
    db.commit()
    db.refresh(tour)
    tours.append(tour)

print("✅ Tours creados")

# ------------------------
# 5️⃣ Crear reservas de prueba
# ------------------------
for _ in range(15):
    user = random.choice(users[1:])  # No usar admin
    flight = random.choice(flights)
    hotel = random.choice(hotels)
    tour = random.choice(tours)

    booking = models.Booking(
        user_id=user.id,
        flight_id=flight.id,
        hotel_id=hotel.id,
        tour_id=tour.id,
        total_price=flight.price + hotel.price_per_night + tour.price,
        status=models.BookingStatus.CONFIRMED,
    )

    flight.available_seats -= 1
    hotel.available_rooms -= 1
    tour.available_slots -= 1

    db.add(booking)
    db.commit()
    db.refresh(booking)

print("✅ Reservas de prueba creadas")

db.close()
print("🎉 Seed completo listo!")
