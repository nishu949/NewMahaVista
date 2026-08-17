from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List
from pydantic import BaseModel
from ..services.recommendation_service import get_recommendations
from ..crud import get_destination_by_id, increment_popularity
from ..database import destinations_collection, festivals_collection

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

# Pydantic model for preferences validation
class RecommendationPreferences(BaseModel):
    month: str
    interests: Optional[List[str]] = []
    travel_with: Optional[str] = None
    budget: Optional[str] = None
    duration: Optional[str] = None
    weather_preference: Optional[str] = "No Preference"
    transport: Optional[str] = "No Preference"
    starting_city: Optional[str] = None
    adventure_level: Optional[str] = None
    avoid: Optional[List[str]] = []

@router.post("/")
async def get_personalized_recommendations(preferences: RecommendationPreferences):
    """
    Get personalized travel recommendations based on user preferences.
    Scores ALL eligible Maharashtra destinations and returns top 10.
    """
    
    try:
        result = get_recommendations(preferences.dict())
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )

@router.get("/month/{month}")
async def get_recommendations_by_month(
    month: str,
    category: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=20)
):
    """Quick recommendations for a specific month"""
    
    query = {
        "state": "Maharashtra",
        "is_active": True,
        "best_months": month
    }
    
    if category:
        query["categories"] = category
    
    destinations = list(
        destinations_collection.find(query)
        .sort([("popularity_score", -1)])
        .limit(limit)
    )
    
    for dest in destinations:
        dest["_id"] = str(dest["_id"])
    
    festivals = list(
        festivals_collection.find({
            "state": "Maharashtra",
            "month": month,
            "is_active": True
        })
    )
    
    for fest in festivals:
        fest["_id"] = str(fest["_id"])
    
    return {
        "month": month,
        "destinations": destinations,
        "festivals": festivals,
        "total_destinations": len(destinations),
        "total_festivals": len(festivals)
    }

@router.get("/festivals/month/{month}")
async def get_festivals_by_month(month: str):
    """Get festivals happening in a specific month"""
    festivals = list(
        festivals_collection.find({
            "state": "Maharashtra",
            "month": month,
            "is_active": True
        })
    )
    
    for fest in festivals:
        fest["_id"] = str(fest["_id"])
    
    return {
        "month": month,
        "festivals": festivals,
        "total": len(festivals)
    }

@router.get("/categories")
async def get_recommendation_categories():
    """Get all available categories"""
    all_categories = set()
    for dest in destinations_collection.find({"state": "Maharashtra"}, {"categories": 1}):
        for cat in dest.get("categories", []):
            all_categories.add(cat)
    
    return {"categories": sorted(list(all_categories))}

@router.get("/months/available")
async def get_recommendation_months():
    """Get all months with data available"""
    months = set()
    for dest in destinations_collection.find({"state": "Maharashtra"}, {"best_months": 1}):
        for month in dest.get("best_months", []):
            months.add(month)
    
    month_order = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"]
    
    sorted_months = sorted([m for m in months if m in month_order], 
                          key=lambda x: month_order.index(x))
    
    return {"months": sorted_months}

@router.get("/destinations/{destination_id}")
async def get_destination_detail(destination_id: str):
    """Get detailed information about a specific destination"""
    destination = get_destination_by_id(destination_id)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    increment_popularity(destination_id)
    return destination

@router.get("/search")
async def search_destinations(
    q: str,
    limit: int = Query(10, ge=1, le=20)
):
    """Search destinations by name or description"""
    if not q:
        raise HTTPException(status_code=400, detail="Search query required")
    
    query = {
        "state": "Maharashtra",
        "is_active": True,
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}},
            {"district": {"$regex": q, "$options": "i"}}
        ]
    }
    
    destinations = list(
        destinations_collection.find(query)
        .sort([("popularity_score", -1)])
        .limit(limit)
    )
    
    for dest in destinations:
        dest["_id"] = str(dest["_id"])
    
    return {
        "query": q,
        "results": destinations,
        "total": len(destinations)
    }