from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from ..crud import (
    get_destination_by_id,
    get_destination_by_slug,
    get_all_destinations,
    get_all_categories,
    get_available_months,
    get_all_districts
)
from ..database import destinations_collection

router = APIRouter(prefix="/api/destinations", tags=["destinations"])

# ========== SPECIFIC ROUTES FIRST (BEFORE DYNAMIC ROUTES) ==========

@router.get("/months")
async def get_available_months_endpoint():
    """Get all months that have destinations"""
    months = get_available_months()
    return {"months": months}

@router.get("/categories")
async def get_all_categories_endpoint():
    """Get all unique categories"""
    categories = get_all_categories()
    return {"categories": categories}

@router.get("/districts")
async def get_all_districts_endpoint():
    """Get all districts in Maharashtra"""
    districts = get_all_districts()
    return {"districts": districts}

@router.get("/slug/{slug}")
async def get_destination_by_slug_endpoint(slug: str):
    """Get a destination by slug"""
    destination = get_destination_by_slug(slug)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination

# ========== MAIN ROUTE ==========

@router.get("/")
async def get_all_destinations_endpoint(
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    category: Optional[str] = None,
    month: Optional[str] = None
):
    """Get all destinations with optional filters"""
    
    destinations = get_all_destinations(limit, skip, category, month)
    
    # Get total count for pagination
    query = {"state": "Maharashtra", "is_active": True}
    if category:
        query["categories"] = category
    if month:
        query["best_months"] = month
    total = destinations_collection.count_documents(query)
    
    return {
        "destinations": destinations,
        "pagination": {
            "total": total,
            "limit": limit,
            "skip": skip,
            "has_more": skip + limit < total
        }
    }

# ========== DYNAMIC ROUTES LAST ==========

@router.get("/{destination_id}")
async def get_destination_by_id_endpoint(destination_id: str):
    """Get a single destination by ID"""
    destination = get_destination_by_id(destination_id)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination