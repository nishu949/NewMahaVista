from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile, File, HTTPException
from ..services.video_service import generate_maharashtra_video
import random
from ..services.video_service import (
    generate_maharashtra_video
)
from ..database import mysteries_collection
from ..services.mystery_service import MysteryService


router = APIRouter(
    prefix="/api/mysteries",
    tags=["Maharashtra Mystery"]
)


# ============================================================
# REQUEST MODELS
# ============================================================

class AnswerRequest(BaseModel):
    answer: str
    clues_used: int = 0

@router.post("/generate-video")
async def generate_video(
    image: UploadFile = File(...)
):

    # ======================================================
    # Validate file
    # ======================================================

    if not image.content_type:
        raise HTTPException(
            status_code=400,
            detail="Image type could not be detected."
        )

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG or WebP image."
        )

    # ======================================================
    # Read image
    # ======================================================

    image_bytes = await image.read()

    # 5 MB limit
    if len(image_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 5MB."
        )

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # ======================================================
    # Generate video
    # ======================================================

    try:

        result = generate_maharashtra_video(
            image_bytes=image_bytes,
            mime_type=image.content_type
        )

        return {
            "success": True,
            "message": "Maharashtra story video generated successfully.",
            "filename": result["filename"],
            "video_url": (
                f"/generated-videos/"
                f"{result['filename']}"
            )
        }

    except Exception as e:

        print(
            "❌ Video generation error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Video generation failed: {str(e)}"
        )
# GET RANDOM MYSTERY
# ============================================================

@router.get("/random")
async def get_random_mystery(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None)
):
    """
    Get a random active Maharashtra mystery.
    """

    query = {
        "is_active": True
    }

    if category:
        query["category"] = category

    if difficulty:
        query["difficulty"] = difficulty

    mysteries = list(
        mysteries_collection.find(query)
    )

    if not mysteries:
        raise HTTPException(
            status_code=404,
            detail="No mysteries found."
        )

    mystery = random.choice(mysteries)

    mystery = MysteryService.sanitize_mystery(
        mystery
    )

    return {
        "success": True,
        "mystery": mystery
    }


# ============================================================
# GET MYSTERY BY ID
# ============================================================

@router.get("/{mystery_id}")
async def get_mystery(
    mystery_id: str
):

    from bson import ObjectId

    try:
        object_id = ObjectId(mystery_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid mystery ID."
        )

    mystery = mysteries_collection.find_one({
        "_id": object_id,
        "is_active": True
    })

    if not mystery:
        raise HTTPException(
            status_code=404,
            detail="Mystery not found."
        )

    mystery = MysteryService.sanitize_mystery(
        mystery
    )

    return {
        "success": True,
        "mystery": mystery
    }


# ============================================================
# GET CLUE
# ============================================================

@router.get("/{mystery_id}/clue/{clue_number}")
async def get_clue(
    mystery_id: str,
    clue_number: int
):

    from bson import ObjectId

    if clue_number < 1 or clue_number > 3:
        raise HTTPException(
            status_code=400,
            detail="Clue number must be between 1 and 3."
        )

    try:
        object_id = ObjectId(mystery_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid mystery ID."
        )

    mystery = mysteries_collection.find_one({
        "_id": object_id,
        "is_active": True
    })

    if not mystery:
        raise HTTPException(
            status_code=404,
            detail="Mystery not found."
        )

    clues = mystery.get(
        "clues",
        []
    )

    if len(clues) < clue_number:
        raise HTTPException(
            status_code=404,
            detail="Clue not available."
        )

    return {
        "success": True,
        "clue_number": clue_number,
        "clue": clues[clue_number - 1]
    }


# ============================================================
# CHECK ANSWER
# ============================================================

@router.post("/{mystery_id}/answer")
async def check_mystery_answer(
    mystery_id: str,
    request: AnswerRequest
):

    from bson import ObjectId

    try:
        object_id = ObjectId(mystery_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid mystery ID."
        )

    mystery = mysteries_collection.find_one({
        "_id": object_id,
        "is_active": True
    })

    if not mystery:
        raise HTTPException(
            status_code=404,
            detail="Mystery not found."
        )

    if request.clues_used < 0 or request.clues_used > 3:
        raise HTTPException(
            status_code=400,
            detail="Invalid clues_used value."
        )

    accepted_answers = mystery.get(
        "accepted_answers",
        []
    )

    # Include the main answer as well
    if mystery.get("answer"):
        accepted_answers.append(
            mystery["answer"]
        )

    correct = MysteryService.check_answer(
        request.answer,
        accepted_answers
    )

    if not correct:

        return {
            "success": True,
            "correct": False,
            "message": "That's not the answer. Try again!"
        }

    reward = MysteryService.calculate_reward(
        request.clues_used
    )

    return {
        "success": True,
        "correct": True,

        "message": "🎉 Mystery solved!",

        "answer": mystery.get(
            "answer"
        ),

        "category": mystery.get(
            "category"
        ),

        "related_destination": mystery.get(
            "related_destination"
        ),

        "image_url": mystery.get(
            "image_url"
        ),

        "story_enabled": mystery.get(
            "story_enabled",
            False
        ),

        "story_types": mystery.get(
            "story_types",
            []
        ),

        "reward": reward
    }


# ============================================================
# GET CATEGORIES
# ============================================================

@router.get("/categories/list")
async def get_mystery_categories():

    categories = mysteries_collection.distinct(
        "category",
        {
            "is_active": True
        }
    )

    return {
        "success": True,
        "categories": sorted(categories)
    }


# ============================================================
# GET DIFFICULTIES
# ============================================================

@router.get("/difficulties/list")
async def get_mystery_difficulties():

    difficulties = mysteries_collection.distinct(
        "difficulty",
        {
            "is_active": True
        }
    )

    return {
        "success": True,
        "difficulties": sorted(difficulties)
    }