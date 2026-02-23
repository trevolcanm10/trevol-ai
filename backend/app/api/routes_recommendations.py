"""
Función para obtener las recomendaciones personalizadas
"""
from fastapi import APIRouter, Depends#Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db.database import get_db
from app.services import recommendation_service#Importamos el servicio de las recomendaciones

router = APIRouter()#Creamos el router


@router.get("/{user_id}")#Ruta para obtener las recomendaciones personalizadas
def user_recommendations(user_id: int, db: Session = Depends(get_db)):
    """
    Función para obtener las recomendaciones personalizadas
    """
    return recommendation_service.get_user_recommendations(user_id, db)
