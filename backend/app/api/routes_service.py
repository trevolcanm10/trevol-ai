"""
Rutas para los servicios
"""
from fastapi import APIRouter, Depends, HTTPException, status #Dependencias de FastAPI
from sqlalchemy.orm import Session #Para trabajar con sesiones de la base de datos
from app.db.database import get_db #Importamos la sesión de la base de datos
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate #Importamos el schema de la reserva
from app.db.models import Service #Importamos el modelo de servicio
from app.dependencies import require_role

router = APIRouter() #Creamos el router

# =========================
# Crear servicio
# POST /api/services
# =========================
@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin")),
):
    """
    Función para crear un nuevo servicio
    - service: Datos del servicio
    - db: Sesión de la base de datos
    - return: El servicio creado
    """
    new_service = Service(**service.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

# =========================
# Obtener todos los servicios
# GET /api/services
# =========================
@router.get("/", response_model=list[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    """
    Función para obtener todos los servicios
    - db: Sesión de la base de datos
    - return: Todos los servicios
    """
    return db.query(Service).all()

# =========================
# Obtener servicio por ID
# GET /api/services/{service_id}
# =========================
@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """
    Función para obtener un servicio por ID
    - service_id: ID del servicio
    - db: Sesión de la base de datos
    - return: El servicio obtenido
    """
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

# =========================
# Actualizar servicio
# PUT /api/services/{service_id}
# =========================
@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_update: ServiceUpdate,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin")),
):
    """
    Función para actualizar un servicio
    - service_id: ID del servicio
    - service_update: Datos actualizados del servicio
    - db: Sesión de la base de datos
    - return: El servicio actualizado
    """
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    for key, value in service_update.dict(exclude_unset=True).items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    return service

# =========================
# Eliminar servicio
# DELETE /api/services/{service_id}
# =========================
@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin")),
):
    """
    Función para eliminar un servicio
    - service_id: ID del servicio
    - db: Sesión de la base de datos
    - return: Mensaje de confirmación
    """
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}