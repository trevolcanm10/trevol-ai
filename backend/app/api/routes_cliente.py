"""
Rutas para el cliente
"""
from fastapi import APIRouter, Depends, HTTPException#Dependencias de FastAPI
from sqlalchemy.orm import Session#Para trabajar con sesiones de la base de datos
from app.db.database import get_db#Importamos la sesión de la base de datos
from app.db.models import User #Importamos el modelo de usuario
from app.core.security import get_password_hash, verify_password,create_access_token
from fastapi.security import OAuth2PasswordRequestForm  # Dependencias de FastAPI
from app.schemas.cliente import (
    ClienteRegistro,
    Token,
)  # Importamos el schema de usuario

# Importamos las funciones de seguridad
from app.dependencies import get_current_user #Importamos la dependencia
router = APIRouter(tags=["Auth"]) #Creamos el router

@router.post("/register")#Ruta para registrar un usuario
def register_cliente(cliente: ClienteRegistro, db: Session = Depends(get_db)):
    """
    Función para registrar un usuario}
    - cliente: Datos del usuario
    - db: Sesión de la base de datos
    """
    existing_cliente = db.query(User).filter(User.email == cliente.email).first()
    if existing_cliente:
        raise HTTPException(status_code=400, detail="El correo electrónico ya esta registrado")
    nuevo_cliente = User(
        name=cliente.username,
        email = cliente.email,
        phone = cliente.phone,
        password = get_password_hash(cliente.password),#Hasheamos el passwords
        role = "user"
    )

    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return {"message": "Usuario registrado exitosamente"}

@router.post("/login", response_model=Token)#Ruta para loguear un usuario
def login_cliente(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Función para loguear un usuario
    - cliente: Datos del usuario
    - db: Sesión de la base de datos
    """
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = create_access_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/secure-endpoint")
def secure_data(current_user=Depends(get_current_user)):
    """
    Función para obtener datos protegidos
    """
    return {"message": "Protected route", "user": current_user.email}
