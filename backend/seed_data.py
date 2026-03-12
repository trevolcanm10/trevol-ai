"""
Función para poblar la base de datos
"""
import random#Para trabajar con numeros aleatorios
import pandas as pd  # Para trabajar con dataframes
from sqlalchemy import create_engine  # Para crear la base de datos
from sqlalchemy.orm import sessionmaker  # Para trabajar con sesiones
from sqlalchemy.exc import SQLAlchemyError, IntegrityError#Para trabajar con bases de datos
from app.db.models import Base, Flight  # Importamos los modelos

# Conexion a la base de datos
engine = create_engine("sqlite:///travel_ai.db")
Session = sessionmaker(bind=engine)
session = Session()
Base.metadata.create_all(engine)  # Creamos las tablas en la base de datos

# Limpieza: Borramos los vuelos antiguos para evitar datos incompletos
try:
    num_borrados = session.query(Flight).delete()
    session.commit()
    print(f"Se borraron {num_borrados} vuelos antiguos para actualizar el esquema.")
except SQLAlchemyError as e:
    session.rollback()
    print(f"Error de base de datos al limpiar: {e}")

# Leer dataset: Cargamos los datos
try:
    df_flights = pd.read_csv("data/flights.csv")

    nuevos_vuelos = []
    for _, row in df_flights.iterrows():
        # Convertimos la fecha a objeto datetime de Python
        fecha_salida = pd.to_datetime(row["departure_date"])

        # Creamos el objeto con todas las columnas nuevas
        nuevo_vuelo = Flight(
            origin=row["origin"],
            origin_country=row.get("origin_country"),  # NUEVA
            destination=row["destination"],
            destination_city=row["destination_city"],
            destination_country=row.get("destination_country"),  # NUEVA
            departure_date=fecha_salida,
            price=float(row.get("price", random.randint(80, 450))),
            available_seats=int(row.get("available_seats", random.randint(20, 180))),
        )
        nuevos_vuelos.append(nuevo_vuelo)

    # 4. INSERCIÓN MASIVA: Usamos add_all para mayor velocidad
    session.add_all(nuevos_vuelos)
    session.commit()
    print(f"¡Éxito! Se han insertado {len(nuevos_vuelos)} vuelos actualizados.")

except FileNotFoundError:
    print("Error: No se encontró el archivo 'data/flights.csv'.")
except IntegrityError as e:
    session.rollback()
    print(f"Error de integridad (posible duplicado o dato nulo): {e}")
except SQLAlchemyError as e:
    session.rollback()
    print(f"Error general de base de datos: {e}")
finally:
    session.close()
"""
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
"""
