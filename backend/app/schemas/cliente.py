"""
Schemas para clientes
"""
from typing import Annotated
from pydantic import BaseModel, EmailStr,constr


class ClienteRegistro(BaseModel):
    """
    Schema para el registro de clientes
    """
    name: str
    email: EmailStr
    phone: str
    password: Annotated[str, constr(min_length=6, max_length=72)]
    role: str = "user"


class ClienteResponse(BaseModel):
    """
    Schema para responder datos del cliente
    """

    id: int
    name: str
    email: EmailStr
    phone: str

    class Config:
        """
        Configuración del schema
        """
        from_attributes = True


class ClienteLogin(BaseModel):
    """
    Schema para el login de clientes
    """
    email: EmailStr
    password: Annotated[str, constr(min_length=6, max_length=72)]

class Token(BaseModel):
    """
    Schema para el token
    """
    access_token: str
    refresh_token: str
    token_type: str
    role: str
    name: str
