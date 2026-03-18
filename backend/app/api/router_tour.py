"""
Rutas para el tour    
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models import Tour
from app.schemas.tour import TourCreate, TourResponse, TourUpdate
from app.dependencies import require_role

router = APIRouter(tags=["Tours"])

@router.post("/", response_model=TourResponse)
def create_tour(
    tour: TourCreate,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin"))
):
    """
    Función para crear un tour
    """
    new_tour = Tour(**tour.dict())
    db.add(new_tour)
    db.commit()
    db.refresh(new_tour)
    return new_tour

@router.get("/", response_model=List[TourResponse])
def get_tours(db: Session = Depends(get_db)):
    """
    Función para obtener todos los tours
    """
    return db.query(Tour).all()

@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(tour_id: int, db: Session = Depends(get_db)):
    """
    Función para obtener un tour por ID
    """
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour no encontrado")
    return tour

@router.put("/{tour_id}", response_model=TourResponse)
def update_tour(
    tour_id: int,
    tour_update: TourUpdate,
    db: Session = Depends(get_db),
    _current_user = Depends(require_role("admin"))
):
    """
    Función para actualizar un tour
    """
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour no encontrado")
    for key, value in tour_update.dict(exclude_unset=True).items():
        setattr(tour, key, value)
    db.commit()
    db.refresh(tour)
    return tour

@router.delete("/{tour_id}")
def delete_tour(tour_id: int, db: Session = Depends(get_db), _current_user = Depends(require_role("admin"))):
    """
    Función para eliminar un tour
    """
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour no encontrado")
    db.delete(tour)
    db.commit()
    return {"message": "Tour eliminado"}
