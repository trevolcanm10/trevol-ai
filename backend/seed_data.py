"""
Script para poblar la base de datos con datos simulados (Fake Data)
Optimizado para el análisis de ventas de Lams Viajes (Incluye Seguros y Trámites).
"""
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models import Base, User, Flight, Hotel, Tour, Booking, BookingStatus

# Configuración de la base de datos
engine = create_engine("sqlite:///travel_ai.db")
Session = sessionmaker(bind=engine)
session = Session()

def seed_database():
    print("Iniciando población de base de datos con servicios diversificados...")
    
    # 1. Limpiar base de datos
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    
    # 2. Crear Usuarios (Admin y Clientes)
    users = [
        User(name="Jose Admin", email="jose@gmail.com", phone="981256789", password="1234567", role="admin"),
        User(name="Denilson", email="denilson@gmail.com", phone="906718876", password="1234567", role="user"),
        User(name="Renzo Munayco", email="renzo@gmail.com", phone="923280522", password="1234567", role="user"),
        User(name="Ana Garcia", email="ana@gmail.com", phone="987654321", password="1234567", role="user"),
        User(name="Carlos Ruiz", email="carlos@gmail.com", phone="912345678", password="1234567", role="user"),
    ]
    session.add_all(users)
    session.commit()
    print("- Usuarios creados.")

    # 3. Crear Vuelos
    destinations = [
        {"city": "Cusco", "country": "Perú", "origin": "Lima"},
        {"city": "Arequipa", "country": "Perú", "origin": "Lima"},
        {"city": "Cancún", "country": "México", "origin": "Lima"},
        {"city": "Madrid", "country": "España", "origin": "Lima"},
    ]
    
    flights = []
    for dest in destinations:
        for i in range(3):
            date = datetime.now() + timedelta(days=random.randint(1, 60))
            flights.append(Flight(
                origin=dest["origin"],
                origin_country="Perú",
                destination=dest["city"],
                destination_city=dest["city"],
                destination_country=dest["country"],
                departure_date=date,
                price=random.randint(50, 800),
                available_seats=random.randint(10, 150)
            ))
    session.add_all(flights)
    session.commit()
    print("- Vuelos creados.")

    # 4. Crear Hoteles
    hotels = [
        Hotel(name="Lams Luxury Cusco", location="Cusco", price_per_night=150, available_rooms=20),
        Hotel(name="Arequipa Suites", location="Arequipa", price_per_night=80, available_rooms=15),
        Hotel(name="Cancun Star", location="Cancún", price_per_night=250, available_rooms=30),
    ]
    session.add_all(hotels)
    session.commit()
    print("- Hoteles creados.")

    # 5. Crear Servicios Diversificados (Categorizados)
    lams_services = [
        {"name": "Seguro de Viaje Premium", "cat": "seguro", "price": 45, "loc": "Global"},
        {"name": "Trámite de Pasaporte Biométrico", "cat": "tramite", "price": 60, "loc": "Lima"},
        {"name": "Asesoría de Visa Americana", "cat": "tramite", "price": 100, "loc": "Lima"},
        {"name": "Traslado Full-Day Paracas", "cat": "traslado", "price": 120, "loc": "Ica"},
        {"name": "Paquete Grupos Escolares", "cat": "grupo_escolar", "price": 180, "loc": "Nacional"},
        {"name": "Residencia Migratoria PE", "cat": "migratorio", "price": 250, "loc": "Lima"},
    ]
    
    tours = []
    for service in lams_services:
        tours.append(Tour(
            name=service["name"],
            location=service["loc"],
            category=service["cat"],
            price=service["price"],
            available_slots=random.randint(20, 100)
        ))
    session.add_all(tours)
    session.commit()
    print("- Servicios categorizados creados.")

    # 6. Crear Reservas Simuladas para Análisis
    all_users = session.query(User).filter(User.role == "user").all()
    all_flights = session.query(Flight).all()
    all_tours = session.query(Tour).all()

    bookings = []
    for i in range(30):
        user_client = random.choice(all_users)
        flight = random.choice(all_flights)
        tour_service = random.choice(all_tours)
        
        booking_date = datetime.now() - timedelta(days=random.randint(0, 30))
        total = flight.price + tour_service.price
        
        bookings.append(Booking(
            user_id=user_client.id,
            flight_id=flight.id,
            tour_id=tour_service.id,
            booking_date=booking_date,
            total_price=total,
            status=BookingStatus.CONFIRMED
        ))
    
    session.add_all(bookings)
    session.commit()
    print("- Historial de ventas simulado.")

    print("\n¡Configuración lógica completa!")

if __name__ == "__main__":
    seed_database()
    session.close()
