"""
    Función para generar un token JWT
"""
from datetime import datetime, timedelta#Para trabajar con fechas
from jose import jwt#Para trabajar con JWT
from passlib.context import CryptContext#Para trabajar con passwords
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
#Para trabajar con variables de entorno

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")#Creamos el contexto de passwords

# Hashear password
def get_password_hash(password: str):
    """
    Función para hashear un password
    """
    return pwd_context.hash(password)
#Verificar password
def verify_password(plain_password: str, hashed_password: str):
    """
    Función para verificar un password
    """
    return pwd_context.verify(plain_password, hashed_password)
#Generar token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Función para generar un token JWT
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt