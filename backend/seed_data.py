"""
Script para poblar la base de datos con datos simulados (Fake Data)
Optimizado para Lams Viajes: Hashing de contraseñas, multi-destinos y servicios categorizados.
"""
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models import Base, User, Flight, Hotel, Tour, Booking, BookingStatus
from app.core.security import get_password_hash

# Configuración de la base de datos
engine = create_engine("sqlite:///travel_ai.db")
Session = sessionmaker(bind=engine)
session = Session()

def seed_database():
    print("Iniciando población de base de datos desde cero...")
    
    # 1. Limpiar base de datos (RESET COMPLETO)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    
    # Hashear contraseña común (1234567)
    hashed_pass = get_password_hash("1234567")

    # 2. Crear Usuarios
    users = [
        User(name="Jose Admin", email="jose@gmail.com", phone="981256789", password=hashed_pass, role="admin"),
        User(name="Denilson", email="denilson@gmail.com", phone="906718876", password=hashed_pass, role="user"),
        User(name="Renzo Munayco", email="renzo@gmail.com", phone="923280522", password=hashed_pass, role="user"),
        User(name="Ana Garcia", email="ana@gmail.com", phone="987654321", password=hashed_pass, role="user"),
        User(name="Carlos Ruiz", email="carlos@gmail.com", phone="912345678", password=hashed_pass, role="user"),
    ]
    session.add_all(users)
    session.commit()
    print("- Usuarios creados con hashing.")

    # 3. Crear Vuelos
    destinations = [
        {"city": "Cusco", "country": "Perú", "origin": "Lima"},
        {"city": "Arequipa", "country": "Perú", "origin": "Lima"},
        {"city": "Cancún", "country": "México", "origin": "Lima"},
        {"city": "Madrid", "country": "España", "origin": "Lima"},
    ]
    
    flights = []
    for dest in destinations:
        for i in range(5):
            date = datetime.now() + timedelta(days=random.randint(1, 60))
            flights.append(Flight(
                origin=dest["origin"],
                origin_country="Perú",
                destination=dest["city"],
                destination_city=dest["city"],
                destination_country=dest["country"],
                departure_date=date,
                price=random.randint(80, 750),
                available_seats=random.randint(20, 180)
            ))
    session.add_all(flights)
    session.commit()
    print("- Vuelos creados para todos los destinos.")

    # 4. Crear Hoteles para CADA destino
    hotels = [
        # Cusco
        Hotel(name="Lams Palace Cusco", location="Cusco", price_per_night=120, available_rooms=15),
        Hotel(name="Inka Luxury Stay", location="Cusco", price_per_night=180, available_rooms=10),
        # Arequipa
        Hotel(name="White City Boutique", location="Arequipa", price_per_night=85, available_rooms=20),
        Hotel(name="Arequipa Grand Hotel", location="Arequipa", price_per_night=105, available_rooms=12),
        # Cancún
        Hotel(name="Cancun Star Resort", location="Cancún", price_per_night=280, available_rooms=40),
        Hotel(name="Caribbean Blue Hotel", location="Cancún", price_per_night=210, available_rooms=35),
        # Madrid
        Hotel(name="Madrid Royal Suites", location="Madrid", price_per_night=220, available_rooms=22),
        Hotel(name="Prado View Hotel", location="Madrid", price_per_night=190, available_rooms=18),
    ]
    session.add_all(hotels)
    session.commit()
    print("- Hoteles creados para todos los destinos.")

    # 5. Crear Servicios y Tours Diversificados
    lams_services = [
        # Servicios Globales
        {"name": "Seguro de Viaje Continental", "cat": "seguro", "price": 45, "loc": "Global"},
        {"name": "Trámite de Pasaporte", "cat": "tramite", "price": 65, "loc": "Lima"},
        {"name": "Asesoría de Visa Americana", "cat": "tramite", "price": 120, "loc": "Global"},
        {"name": "Residencia Migratoria PE", "cat": "migratorio", "price": 240, "loc": "Lima"},
        # Cusco
        {"name": "City Tour Cusco Moderno", "cat": "tour", "price": 50, "loc": "Cusco"},
        {"name": "Machu Picchu Maravilla", "cat": "tour", "price": 380, "loc": "Cusco"},
        # Arequipa
        {"name": "Tour Cañón del Colca 2D", "cat": "tour", "price": 110, "loc": "Arequipa"},
        {"name": "Monasterio de Santa Catalina", "cat": "tour", "price": 35, "loc": "Arequipa"},
        # Cancún
        {"name": "Chichén Itzá VIP", "cat": "tour", "price": 130, "loc": "Cancún"},
        {"name": "Xcaret Plus Entradas", "cat": "tour", "price": 160, "loc": "Cancún"},
        # Madrid
        {"name": "Tour Museo del Prado", "cat": "tour", "price": 45, "loc": "Madrid"},
        {"name": "Paseo Histórico de Madrid", "cat": "tour", "price": 25, "loc": "Madrid"},
        # Otros
        {"name": "Traslado Full-Day Paracas", "cat": "traslado", "price": 115, "loc": "Ica"},
        {"name": "Grupos Escolares Promoción", "cat": "grupo_escolar", "price": 190, "loc": "Nacional"},
    ]
    
    for s in lams_services:
        session.add(Tour(
            name=s["name"], location=s["loc"], category=s["cat"], 
            price=s["price"], available_slots=random.randint(15, 80)
        ))
    session.commit()
    print("- Servicios y tours diversificados creados.")

    # 6. Crear Reservas Simuladas (Historial de 40 ventas)
    all_users = session.query(User).filter(User.role == "user").all()
    all_flights = session.query(Flight).all()
    all_hotels = session.query(Hotel).all()
    all_tours = session.query(Tour).all()

    for _ in range(40):
        client = random.choice(all_users)
        flight = random.choice(all_flights)
        dest = flight.destination
        
        # Intentar buscar hotel en el mismo destino
        hotel = next((h for h in all_hotels if h.location == dest), None)
        # Intentar buscar tour en el mismo destino o global
        tour = next((t for t in all_tours if t.location == dest or t.location == "Global"), random.choice(all_tours))
        
        date = datetime.now() - timedelta(days=random.randint(0, 30))
        total = flight.price + (hotel.price_per_night * random.randint(1, 3) if hotel else 0) + tour.price
        
        session.add(Booking(
            user_id=client.id, flight_id=flight.id, 
            hotel_id=hotel.id if hotel else None, 
            tour_id=tour.id,
            booking_date=date, total_price=round(total, 2), 
            status=BookingStatus.CONFIRMED
        ))
    session.commit()
    print("- 40 Reservas de prueba generadas.")
    print("\n¡Base de datos restaurada y poblada con éxito!")

if __name__ == "__main__":
    seed_database()
    session.close()
