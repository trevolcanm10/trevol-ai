"""
Función para poblar la base de datos
"""
import random#Para trabajar con numeros aleatorios
import pandas as pd  # Para trabajar con dataframes
from sqlalchemy import create_engine #Para crear la base de datos
from sqlalchemy.orm import sessionmaker #Para trabajar con sesiones
from app.db.models import Base, Flight, Hotel, Tour #Importamos los modelos

# Conexion a la base de datos
engine = create_engine("sqlite:///travel_ai.db")
Session = sessionmaker(bind=engine)
session = Session()
# Crear tablas si no existen
Base.metadata.create_all(engine)

# Poblar Flights
df_flights = pd.read_csv('data/flights.csv')
for _, row in df_flights.iterrows():
    flight = Flight(
        origin=row["origin"],  # Agregamos el origen
        destination=row["destination"],  # Agregamos el destino
        departure_date=pd.to_datetime(row["departure_date"]),  # Convertimos a datetime
        price=float(row.get("price", random.randint(50, 500))),  # Agregamos el precio
        available_seats=int(row.get("available_seats", random.randint(20, 200))),
        # Agregamos el asiento
    )
    session.add(flight)

# Poblar Hotels
df_hotels = pd.read_csv('data/hotels.csv')

for _, row in df_hotels.iterrows():
    hotel = Hotel(
        name = row["name"],# Agregamos el nombre
        location = row["location"],# Agregamos la ubicacion
        price_per_night = float(row.get("price_per_night", random.randint(50, 300))),
        # Agregamos el precio
        available_rooms = int(row.get("available_rooms", random.randint(5, 50))),
        # Agregamos el asiento
    )
    session.add(hotel)

# Poblar Tours
df_tours = pd.read_csv('data/tours.csv')

for _, row in df_tours.iterrows():
    tour = Tour(
        name = row["name"],# Agregamos el nombre
        location = row["location"],# Agregamos la ubicacion
        price = float(row.get("price", random.randint(50, 300))),# Agregamos el precio
        available_slots = int(row.get("available_slots", random.randint(5, 50))),
        # Agregamos el asiento
    )
    session.add(tour)
session.commit()# Guardamos los cambios
print("Flights, Hotels y Tours insertados correctamente.")
