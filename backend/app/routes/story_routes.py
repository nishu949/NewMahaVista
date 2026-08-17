from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..crud import (
    get_stories_by_city,
    get_featured_story,
    get_story_by_id,
    get_similar_stories,
    search_stories,
    like_story
)
from ..database import stories_collection

router = APIRouter(prefix="/api/stories", tags=["stories"])

@router.get("/city/{city}")
async def get_stories_by_city_endpoint(
    city: str,
    category: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    page: int = Query(1, ge=1)
):
    """Get stories for a city with pagination"""
    skip = (page - 1) * limit
    stories = get_stories_by_city(city, category, limit, skip)
    
    # Get total count
    query = {"city": city}
    if category and category != "All":
        query["category"] = category
    total = stories_collection.count_documents(query)
    
    return {
        "stories": stories,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    }

@router.get("/city/{city}/featured")
async def get_featured_story_endpoint(city: str):
    """Get featured story for a city"""
    story = get_featured_story(city)
    if not story:
        raise HTTPException(status_code=404, detail="No featured story found")
    return story

@router.get("/{story_id}")
async def get_story_endpoint(story_id: str):
    """Get a single story by ID"""
    story = get_story_by_id(story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@router.get("/{story_id}/similar")
async def get_similar_stories_endpoint(
    story_id: str, 
    limit: int = Query(5, ge=1, le=10)
):
    """Get similar stories"""
    stories = get_similar_stories(story_id, limit)
    return stories

@router.get("/search")
async def search_stories_endpoint(
    q: str, 
    limit: int = Query(20, ge=1, le=50)
):
    """Search stories"""
    if not q:
        raise HTTPException(status_code=400, detail="Search query required")
    stories = search_stories(q, limit)
    return stories

@router.post("/{story_id}/like")
async def like_story_endpoint(story_id: str):
    """Like a story"""
    success = like_story(story_id)
    if not success:
        raise HTTPException(status_code=404, detail="Story not found")
    return {"message": "Story liked successfully"}

@router.get("/categories")
async def get_story_categories():
    """Get all unique story categories"""
    categories = stories_collection.distinct("category")
    return {"categories": categories}

@router.get("/cities")
async def get_story_cities():
    """Get all unique story cities"""
    cities = stories_collection.distinct("city")
    return {"cities": cities}