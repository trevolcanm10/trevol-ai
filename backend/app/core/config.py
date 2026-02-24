"""
    Configuración de la aplicación
"""
import os #Para trabajar con variables de entorno
from dotenv import load_dotenv #Para trabajar con variables de entorno

load_dotenv() #Cargamos las variables de entorno desde el archivo .env

SECRET_KEY = os.environ.get("SECRET_KEY") #Obtenemos la clave secreta desde la variable de entorno
ALGORITHM = os.getenv("ALGORITHM") #Obtenemos el algoritmo desde la variable de entorno
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")) 
#Obtenemos el tiempo de expiración del token desde la variable de entorno
