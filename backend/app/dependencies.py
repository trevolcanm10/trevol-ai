""" 
Dependencias
"""
from fastapi import Depends, HTTPException #Dependencias de FastAPI
from fastapi.security import OAuth2PasswordBearer 
from sqlalchemy.orm import Session  # Para trabajar con sesiones de la base de datos
from jose import JWTError, jwt, ExpiredSignatureError #Para trabajar con JWT
from app.core.config import SECRET_KEY, ALGORITHM #Para trabajar con variables de entorno
from app.db.database import get_db #Importamos la sesión de la base de datos
from app.db.models import User #Importamos el modelo de usuario

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)  # Creamos el esquema de autenticación


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401, detail="Credenciales de token incorrectas"
            )
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        return user
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Token expirado. Por favor, logueate de nuevo"
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")


def require_role(required_role: str):
    """
    Función para verificar el rol del usuario
    """
    def role_checker(current_user=Depends(get_current_user)):
        """
        Función para verificar el rol del usuario
        """
        if current_user.role != required_role:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        return current_user

    return role_checker
