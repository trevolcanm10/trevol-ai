from sqlalchemy import create_engine#Para crear la base de datos
from sqlalchemy.ext.declarative import declarative_base#Para declarar las tablas
from sqlalchemy.orm import sessionmaker #Para trabajar con sesiones
import os #Para trabajar con variables de entorno

SQLALCHEMY_DATABASE_URL = "sqlite:///./travel_ai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()