"""
Schemas para clientes
"""
from pydantic import BaseModel

class ClienteRegistro(BaseModel):
    """
    Schema para el registro de clientes
    """
    username: str
    password: str

class ClienteLogin(BaseModel):
    """
    Schema para el login de clientes
    """
    username: str
    password: str
    
class Token(BaseModel):
    """
    Schema para el token
    """
    access_token: str
    token_type: str