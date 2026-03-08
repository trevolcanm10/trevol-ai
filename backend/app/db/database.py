"""
Función para obtener la sesión de la base de datos
"""
from sqlalchemy import create_engine#Para crear la base de datos
from sqlalchemy.ext.declarative import declarative_base#Para declarar las tablas
from sqlalchemy.orm import sessionmaker #Para trabajar con sesiones

SQLALCHEMY_DATABASE_URL = "sqlite:///./travel_ai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Función para obtener la sesión de la base de datos
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()