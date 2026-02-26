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
