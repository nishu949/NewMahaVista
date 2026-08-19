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


router = APIRouter(
    prefix="/api/stories",
    tags=["stories"]
)


# ============================================================
# GET ALL STORIES
# ============================================================

@router.get("")
async def get_all_stories(
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    page: int = Query(1, ge=1)
):
    """Get all stories with pagination"""

    skip = (page - 1) * limit

    query = {}

    if category and category != "All":
        query["category"] = category

    stories = list(
        stories_collection
        .find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    for story in stories:
        story["_id"] = str(story["_id"])

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


# ============================================================
# SEARCH
# ============================================================

@router.get("/search")
async def search_stories_endpoint(
    q: str,
    limit: int = Query(20, ge=1, le=50)
):
    """Search stories"""

    if not q:
        raise HTTPException(
            status_code=400,
            detail="Search query required"
        )

    stories = search_stories(q, limit)

    return stories


# ============================================================
# CATEGORIES
# ============================================================

@router.get("/categories")
async def get_story_categories():
    """Get all unique story categories"""

    categories = stories_collection.distinct("category")

    return {
        "categories": categories
    }


# ============================================================
# CITIES
# ============================================================

@router.get("/cities")
async def get_story_cities():
    """Get all unique story cities"""

    cities = stories_collection.distinct("city")

    return {
        "cities": cities
    }


# ============================================================
# STORIES BY CITY
# ============================================================

@router.get("/city/{city}")
async def get_stories_by_city_endpoint(
    city: str,
    category: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    page: int = Query(1, ge=1)
):
    """Get stories for a city with pagination"""

    skip = (page - 1) * limit

    stories = get_stories_by_city(
        city,
        category,
        limit,
        skip
    )

    query = {
        "city": city
    }

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


# ============================================================
# FEATURED STORY BY CITY
# ============================================================

@router.get("/city/{city}/featured")
async def get_featured_story_endpoint(city: str):

    """Get featured story for a city"""

    story = get_featured_story(city)

    if not story:
        raise HTTPException(
            status_code=404,
            detail="No featured story found"
        )

    return story


# ============================================================
# SIMILAR STORIES
# ============================================================

@router.get("/{story_id}/similar")
async def get_similar_stories_endpoint(
    story_id: str,
    limit: int = Query(5, ge=1, le=10)
):
    """Get similar stories"""

    stories = get_similar_stories(
        story_id,
        limit
    )

    return stories


# ============================================================
# LIKE STORY
# ============================================================

@router.post("/{story_id}/like")
async def like_story_endpoint(story_id: str):

    """Like a story"""

    success = like_story(story_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Story not found"
        )

    return {
        "message": "Story liked successfully"
    }


# ============================================================
# GET SINGLE STORY
# ============================================================

@router.get("/{story_id}")
async def get_story_endpoint(story_id: str):

    """Get a single story by ID"""

    story = get_story_by_id(story_id)

    if not story:
        raise HTTPException(
            status_code=404,
            detail="Story not found"
        )

    return story