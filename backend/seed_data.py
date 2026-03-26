"""
Script para poblar la base de datos con datos simulados (Fake Data)
Optimizado para Lams Viajes: Hashing de contraseñas, multi-destinos y servicios categorizados.
"""

import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models import (
    Base,
    User,
    Flight,
    Hotel,
    Tour,
    Booking,
    BookingStatus,
    Service,
    BookingService,
)
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
    # 1 admin fijo
    admin = User(
        name="Jose Admin",
        email="jose@gmail.com",
        phone="981256789",
        password=hashed_pass,
        role="admin",
    )
    session.add(admin)

    # 50 usuarios tipo "user"
    first_names = [
        "Ana",
        "Carlos",
        "Maria",
        "Juan",
        "Luis",
        "Sofia",
        "Pedro",
        "Lucia",
        "Miguel",
        "Elena",
        "Jorge",
        "Carmen",
        "Raul",
        "Patricia",
        "Fernando",
        "Monica",
        "Diego",
        "Veronica",
        "Alberto",
        "Claudia",
        "Oscar",
        "Natalia",
        "Hugo",
        "Silvia",
        "Ricardo",
        "Adriana",
        "Victor",
        "Paula",
        "Roberto",
        "Teresa",
        "Andres",
        "Martha",
        "Gabriel",
        "Carolina",
        "Javier",
        "Beatriz",
        "Sebastian",
        "Alicia",
        "Rafael",
        "Diana",
        "Leonardo",
        "Mariana",
        "Cristian",
        "Lorena",
        "Emilio",
        "Graciela",
        "Arturo",
        "Rosa",
        "Julio",
        "Miriam",
        "Hector",
    ]
    last_names = [
        "Garcia",
        "Rodriguez",
        "Fernandez",
        "Lopez",
        "Martinez",
        "Sanchez",
        "Perez",
        "Gonzalez",
        "Torres",
        "Diaz",
        "Ramirez",
        "Vargas",
        "Castro",
        "Rojas",
        "Silva",
        "Mendoza",
        "Cruz",
        "Gomez",
        "Reyes",
        "Ortega",
        "Morales",
        "Guerrero",
        "Suarez",
        "Chavez",
        "Ramos",
        "Jimenez",
        "De la Cruz",
        "Nunez",
        "Medina",
        "Aguilar",
        "Vega",
        "Soto",
        "Rios",
        "Molina",
        "Cortez",
        "Delgado",
        "Castillo",
        "Pacheco",
        "Navarro",
        "Bravo",
        "Acosta",
        "Mejia",
        "Santos",
        "Mendez",
        "Hernandez",
        "Leon",
        "Villanueva",
        "Cabello",
        "Paredes",
        "Salazar",
    ]

    users = []
    for i in range(50):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        email = f"user{i+1}@gmail.com"
        phone = f"9{random.randint(100000000, 999999999)}"
        users.append(
            User(name=name, email=email, phone=phone, password=hashed_pass, role="user")
        )

    session.add_all(users)
    session.commit()
    print("- Usuarios creados con hashing.")

    # 3. Crear Vuelos
    destinations = [
        # Nuevos destinos con popularidad
        {"city": "Cusco", "country": "Perú", "origin": "Lima", "weight": 6},
        {"city": "Cancún", "country": "México", "origin": "Lima", "weight": 5},
        {"city": "Arequipa", "country": "Perú", "origin": "Lima", "weight": 4},
        {"city": "Madrid", "country": "España", "origin": "Lima", "weight": 3},
        {"city": "Cartagena", "country": "Colombia", "origin": "Lima", "weight": 3},
        {"city": "Buenos Aires", "country": "Argentina", "origin": "Lima", "weight": 2},
        {"city": "Santiago", "country": "Chile", "origin": "Lima", "weight": 2},
        {"city": "Rio de Janeiro", "country": "Brasil", "origin": "Lima", "weight": 2},
        {"city": "Miami", "country": "USA", "origin": "Lima", "weight": 2},
        {
            "city": "Punta Cana",
            "country": "República Dominicana",
            "origin": "Lima",
            "weight": 1,
        },
    ]

    flights = []
    for dest in destinations:
        # Crear entre 5 y 8 vuelos por destino
        num_flights = random.randint(5, 8)
        for i in range(num_flights):
            date = datetime.now() + timedelta(days=random.randint(1, 60))
            flights.append(
                Flight(
                    origin=dest["origin"],
                    origin_country="Perú",
                    destination=dest["city"],
                    destination_city=dest["city"],
                    destination_country=dest["country"],
                    departure_date=date,
                    price=random.randint(80, 750),
                    available_seats=random.randint(20, 180),
                )
            )
    session.add_all(flights)
    session.commit()
    print("- Vuelos creados para todos los destinos.")

    # 4. Crear Hoteles para CADA destino
    hotels = []

    # Crear 2 hoteles por cada destino
    for dest in destinations:
        # Hotel 1
        hotels.append(
            Hotel(
                name=f"{dest['city']} Luxury Hotel",
                location=dest["city"],
                price_per_night=random.randint(100, 300),
                available_rooms=random.randint(15, 40),
            )
        )
        # Hotel 2
        hotels.append(
            Hotel(
                name=f"{dest['city']} Boutique Stay",
                location=dest["city"],
                price_per_night=random.randint(80, 250),
                available_rooms=random.randint(10, 30),
            )
        )

    session.add_all(hotels)
    session.commit()
    print("- Hoteles creados para todos los destinos.")

    # 5. Crear Tours para CADA destino
    tours = []

    # Crear 2-3 tours por cada destino
    for dest in destinations:
        # Tour 1
        tours.append(
            Tour(
                name=f"{dest['city']} City Tour",
                location=dest["city"],
                price=random.randint(30, 100),
                available_slots=random.randint(15, 80),
            )
        )
        # Tour 2
        tours.append(
            Tour(
                name=f"{dest['city']} Historical Tour",
                location=dest["city"],
                price=random.randint(40, 120),
                available_slots=random.randint(15, 80),
            )
        )
        # Tour 3 (solo para destinos con peso >= 3)
        if dest["weight"] >= 3:
            tours.append(
                Tour(
                    name=f"{dest['city']} VIP Experience",
                    location=dest["city"],
                    price=random.randint(100, 400),
                    available_slots=random.randint(10, 50),
                )
            )

    session.add_all(tours)
    session.commit()
    print("- Tours creados para todos los destinos.")

    # 6. Crear Servicios adicionales
    services_data = [
        {
            "name": "Seguro de Viaje Continental",
            "category": "seguro",
            "price": 45,
            "description": "Seguro para viajes internacionales",
            "location_required": False,
            "is_subscription": False,
        },
        {
            "name": "Trámite de Pasaporte",
            "category": "tramite",
            "price": 65,
            "description": "Asesoría para obtención de pasaporte",
            "location_required": True,
            "is_subscription": False,
        },
        {
            "name": "Asesoría de Visa Americana",
            "category": "tramite",
            "price": 120,
            "description": "Asesoría para visa a EE.UU.",
            "location_required": False,
            "is_subscription": False,
        },
        {
            "name": "Residencia Migratoria PE",
            "category": "migratorio",
            "price": 240,
            "description": "Gestión de residencia en Perú",
            "location_required": True,
            "is_subscription": False,
        },
        {
            "name": "Traslado Full-Day Paracas",
            "category": "traslado",
            "price": 115,
            "description": "Traslado full-day a Paracas",
            "location_required": True,
            "is_subscription": False,
        },
        {
            "name": "Grupos Escolares Promoción",
            "category": "grupo_escolar",
            "price": 190,
            "description": "Paquetes para grupos escolares",
            "location_required": False,
            "is_subscription": True,
        },
    ]

    for s in services_data:
        session.add(Service(**s))

    session.commit()
    print("- Servicios adicionales creados.")

    # 7. Crear Reservas Simuladas (300 reservas con distribución de fechas)
    all_users = session.query(User).filter(User.role == "user").all()
    all_flights = session.query(Flight).all()
    all_hotels = session.query(Hotel).all()
    all_tours = session.query(Tour).all()
    all_services = session.query(Service).all()

    # Crear lista de destinos ponderada por popularidad
    weighted_destinations = []
    for dest in destinations:
        weighted_destinations.extend([dest] * dest["weight"])

    bookings = []

    for _ in range(300):
        # Seleccionar cliente
        client = random.choice(all_users)

        # Seleccionar destino basado en popularidad
        selected_dest = random.choice(weighted_destinations)

        # Seleccionar vuelo del destino elegido
        dest_flights = [
            f for f in all_flights if f.destination == selected_dest["city"]
        ]
        flight = random.choice(dest_flights)

        # Seleccionar hotel del mismo destino
        dest_hotels = [h for h in all_hotels if h.location == selected_dest["city"]]
        hotel = random.choice(dest_hotels)

        # Seleccionar tour del mismo destino
        dest_tours = [t for t in all_tours if t.location == selected_dest["city"]]
        tour = random.choice(dest_tours)

        # Generar fecha con distribución: 25% últimos 30 días, 75% últimos 365 días
        if random.random() < 0.25:
            # Últimos 30 días
            date = datetime.now() - timedelta(days=random.randint(0, 30))
        else:
            # Últimos 365 días
            date = datetime.now() - timedelta(days=random.randint(31, 365))

        # Calcular nights (1-5)
        nights = random.randint(1, 5)

        # Calcular servicios adicionales (0-3)
        num_services = random.randint(0, 3)
        services_total = 0
        booking_services = []

        selected_services = random.sample(
    all_services,
    k=min(num_services, len(all_services))
)

        for service in selected_services:
            quantity = random.randint(1, 2)

            service_cost = service.price * quantity
            services_total += service_cost

            booking_services.append((service, quantity))

        # Calcular total_price realista
        total = (
            flight.price
            + (hotel.price_per_night * nights)
            + tour.price
            + services_total
        )

        # Crear reserva
        booking = Booking(
            user_id=client.id,
            flight_id=flight.id,
            hotel_id=hotel.id,
            tour_id=tour.id,
            booking_date=date,
            total_price=round(total, 2),
            status=BookingStatus.CONFIRMED,
        )
        session.add(booking)  # Agregamos la reserva a la base de datos
        session.flush()  # Guardamos los cambios
        # Asociar servicios a la reserva
        for service, quantity in booking_services:
            booking_service = BookingService(
                booking_id=booking.id, service_id=service.id, quantity=quantity
            )
            session.add(booking_service)
    session.commit()
    print("- 300 Reservas generadas con distribución realista.")
    print("\n¡Base de datos restaurada y poblada con éxito!")


if __name__ == "__main__":
    seed_database()
    session.close()
