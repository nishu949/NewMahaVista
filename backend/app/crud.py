# crud.py
import bcrypt
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from .database import (
    users_collection,
    products_collection,
    questions_collection,
    cities_collection,
    trip_inquiries_collection,
    stories_collection,
    destinations_collection, 
    festivals_collection,     
    serialize_doc,
    serialize_list
)

# ========== Destination CRUD ==========
from typing import Optional, List, Dict
from bson import ObjectId
from datetime import datetime

def get_destination_by_id(destination_id: str) -> Optional[Dict]:
    """Get a destination by ID"""
    try:
        destination = destinations_collection.find_one({"_id": ObjectId(destination_id)})
        return serialize_doc(destination)
    except:
        return None

def get_destination_by_slug(slug: str) -> Optional[Dict]:
    """Get a destination by slug"""
    destination = destinations_collection.find_one({"slug": slug, "is_active": True})
    return serialize_doc(destination)

def get_all_destinations(
    limit: int = 50,
    skip: int = 0,
    category: Optional[str] = None,
    month: Optional[str] = None
) -> List[Dict]:
    """Get all active destinations with optional filters"""
    query = {"state": "Maharashtra", "is_active": True}
    
    if category:
        query["categories"] = category
    
    if month:
        query["best_months"] = month
    
    destinations = list(
        destinations_collection.find(query)
        .sort([("popularity_score", -1)])
        .skip(skip)
        .limit(limit)
    )
    return serialize_list(destinations)

def get_destinations_by_month(month: str, limit: int = 10) -> List[Dict]:
    """Get destinations that are best in a specific month"""
    query = {
        "state": "Maharashtra",
        "is_active": True,
        "best_months": month
    }
    destinations = list(
        destinations_collection.find(query)
        .sort([("popularity_score", -1)])
        .limit(limit)
    )
    return serialize_list(destinations)

def get_destinations_by_preferences(
    month: str = None,
    interests: List[str] = None,
    travel_with: str = None,
    budget: str = None,
    duration: str = None,
    weather_preference: str = None,
    transport: str = None,
    starting_city: str = None,
    adventure_level: str = None,
    limit: int = 20
) -> List[Dict]:
    """Get destinations matching user preferences"""
    
    query = {"state": "Maharashtra", "is_active": True}
    
    if month:
        query["best_months"] = month
    
    if interests:
        query["categories"] = {"$in": interests}
    
    if budget:
        query["budget"] = budget
    
    if duration:
        query["recommended_duration"] = duration
    
    if travel_with:
        query["ideal_for"] = travel_with
    
    if adventure_level:
        query["difficulty"] = adventure_level
    
    if starting_city:
        query["starting_cities"] = starting_city
    
    destinations = list(
        destinations_collection.find(query)
        .sort([("popularity_score", -1)])
        .limit(limit)
    )
    
    return serialize_list(destinations)

def create_destination(destination_data: dict) -> Dict:
    """Create a new destination"""
    destination_data["created_at"] = datetime.utcnow()
    destination_data["updated_at"] = datetime.utcnow()
    result = destinations_collection.insert_one(destination_data)
    return serialize_doc(destinations_collection.find_one({"_id": result.inserted_id}))

def update_destination(destination_id: str, update_data: dict) -> Optional[Dict]:
    """Update a destination"""
    update_data["updated_at"] = datetime.utcnow()
    destinations_collection.update_one(
        {"_id": ObjectId(destination_id)},
        {"$set": update_data}
    )
    return get_destination_by_id(destination_id)

def delete_destination(destination_id: str) -> bool:
    """Soft delete a destination"""
    result = destinations_collection.update_one(
        {"_id": ObjectId(destination_id)},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
    )
    return result.modified_count > 0

def increment_popularity(destination_id: str) -> None:
    """Increment popularity score for a destination"""
    destinations_collection.update_one(
        {"_id": ObjectId(destination_id)},
        {"$inc": {"popularity_score": 1}}
    )

def get_nearby_festivals(destination_name: str, month: str) -> List[Dict]:
    """Get festivals near a destination"""
    festivals = list(
        festivals_collection.find({
            "state": "Maharashtra",
            "month": month,
            "related_destinations": destination_name,
            "is_active": True
        })
    )
    return serialize_list(festivals)

def get_all_categories() -> List[str]:
    """Get all unique categories from destinations"""
    categories = set()
    for dest in destinations_collection.find({"state": "Maharashtra"}, {"categories": 1}):
        for cat in dest.get("categories", []):
            categories.add(cat)
    return sorted(list(categories))

def get_available_months() -> List[str]:
    """Get all months that have destinations"""
    months = set()
    for dest in destinations_collection.find({"state": "Maharashtra"}, {"best_months": 1}):
        for month in dest.get("best_months", []):
            months.add(month)
    
    month_order = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"]
    
    return sorted([m for m in months if m in month_order], 
                  key=lambda x: month_order.index(x))

def get_all_districts() -> List[str]:
    """Get all districts in Maharashtra"""
    districts = destinations_collection.distinct("district", {"state": "Maharashtra"})
    return sorted(districts)



# for stories
def get_stories_by_city(
    city: str, 
    category: Optional[str] = None,
    limit: int = 10,
    skip: int = 0
):
    """Get stories by city with optional category filter"""
    query = {"city": city}
    if category and category != "All":
        query["category"] = category
    
    stories = list(
        stories_collection.find(query)
        .sort([("is_featured", -1), ("created_at", -1)])
        .skip(skip)
        .limit(limit)
    )
    return serialize_list(stories)

def get_featured_story(city: str):
    """Get featured story for a city"""
    story = stories_collection.find_one({
        "city": city,
        "is_featured": True
    })
    if not story:
        # Fallback: get most viewed
        story = stories_collection.find_one(
            {"city": city},
            sort=[("view_count", -1)]
        )
    return serialize_doc(story)

def get_story_by_id(story_id: str):
    """Get story by ID and increment view count"""
    story = stories_collection.find_one({"_id": ObjectId(story_id)})
    if story:
        # Increment view count
        stories_collection.update_one(
            {"_id": ObjectId(story_id)},
            {"$inc": {"view_count": 1}}
        )
    return serialize_doc(story)

def get_similar_stories(story_id: str, limit: int = 5):
    """Get similar stories based on city and category"""
    story = stories_collection.find_one({"_id": ObjectId(story_id)})
    if not story:
        return []
    
    similar = list(
        stories_collection.find({
            "_id": {"$ne": ObjectId(story_id)},
            "$or": [
                {"city": story["city"]},
                {"category": story["category"]}
            ]
        })
        .sort([("view_count", -1)])
        .limit(limit)
    )
    return serialize_list(similar)

def search_stories(query: str, limit: int = 20):
    """Search stories by title, description, or tags"""
    search_query = {
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}},
            {"tags": {"$regex": query, "$options": "i"}}
        ]
    }
    stories = list(
        stories_collection.find(search_query)
        .sort([("view_count", -1)])
        .limit(limit)
    )
    return serialize_list(stories)

def create_story(story_data: dict):
    """Create a new story"""
    story_data["created_at"] = datetime.utcnow()
    story_data["updated_at"] = datetime.utcnow()
    result = stories_collection.insert_one(story_data)
    return serialize_doc(stories_collection.find_one({"_id": result.inserted_id}))

def update_story(story_id: str, update_data: dict):
    """Update a story"""
    update_data["updated_at"] = datetime.utcnow()
    stories_collection.update_one(
        {"_id": ObjectId(story_id)},
        {"$set": update_data}
    )
    return serialize_doc(stories_collection.find_one({"_id": ObjectId(story_id)}))

def delete_story(story_id: str):
    """Delete a story"""
    result = stories_collection.delete_one({"_id": ObjectId(story_id)})
    return result.deleted_count > 0

def like_story(story_id: str):
    """Like a story"""
    result = stories_collection.update_one(
        {"_id": ObjectId(story_id)},
        {"$inc": {"likes": 1}}
    )
    return result.modified_count > 0


# ========== Password Utilities ==========
def hash_password(password: str) -> str:
    """Hash password with bcrypt, truncating to 72 bytes if needed"""
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash, truncating to 72 bytes if needed"""
    plain_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

# ========== User CRUD ==========
def get_user_by_email(db, email: str):
    """Get user by email"""
    user = users_collection.find_one({"email": email})
    return serialize_doc(user)

def create_user(db, user):
    """Create a new user"""
    # Hash password
    hashed_password = hash_password(user.password)
    
    user_data = {
        "full_name": user.full_name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = users_collection.insert_one(user_data)
    created_user = users_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(created_user)

# ========== Product CRUD ==========
def get_all_products(db):
    """Get all products"""
    products = list(products_collection.find())
    return serialize_list(products)

# ========== Question CRUD ==========
def get_questions(db, subtopic: str = None):
    """Get questions, optionally filtered by subtopic"""
    query = {}
    if subtopic:
        query["subtopic"] = subtopic
    
    questions = list(questions_collection.find(query))
    return serialize_list(questions)

# ========== City CRUD ==========
def get_city_planner_by_slug(db, slug: str):
    """Get city by slug with all embedded data"""
    city = cities_collection.find_one({"slug": slug})
    if city:
        # Ensure embedded arrays exist
        city["places"] = city.get("places", [])
        city["stays"] = city.get("stays", [])
        city["culture_items"] = city.get("culture_items", [])
        city["transport_items"] = city.get("transport_items", [])
    return serialize_doc(city)

def get_city_by_slug(db, slug: str):
    """Alias for get_city_planner_by_slug"""
    return get_city_planner_by_slug(db, slug)

# ========== Trip Inquiry CRUD ==========
def create_trip_inquiry(db, city_id: int, data):
    """Create a trip inquiry"""
    # Get city to store slug
    city = cities_collection.find_one({"_id": ObjectId(city_id)} if isinstance(city_id, str) else {"id": city_id})
    
    inquiry_data = {
        "city_id": str(city_id),
        "city_slug": city.get("slug") if city else None,
        "full_name": data.full_name,
        "email": data.email,
        "travel_date": data.travel_date,
        "guests": data.guests,
        "special_interests": data.special_interests,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = trip_inquiries_collection.insert_one(inquiry_data)
    created_inquiry = trip_inquiries_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(created_inquiry)

# ========== Booking CRUD ==========
def create_booking(db, booking_data, price, taxes, service_fee, total):
    """Create a new booking"""
    booking = {
        "city": booking_data.city,
        "experience": booking_data.experience,
        "travel_date": booking_data.travel_date.isoformat(),
        "travellers": booking_data.travellers,
        "full_name": booking_data.full_name,
        "email": booking_data.email,
        "phone": booking_data.phone,
        "from_city": booking_data.from_city,
        "special_requests": booking_data.special_requests,
        "price_per_person": price,
        "taxes": taxes,
        "service_fee": service_fee,
        "total": total,
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    result = db["bookings"].insert_one(booking)

    return {
        "booking_id": str(result.inserted_id),
        "status": "pending"
    }

# ========== User Bookings ==========
# ========== GET BOOKINGS BY USER EMAIL ==========

# ========== GET BOOKINGS BY USER EMAIL ==========

def get_bookings_by_email(db, email):
    """Get all bookings made by a specific user"""
    bookings = list(
        db["bookings"]
        .find({"email": email})
        .sort("created_at", -1)
    )

    # Convert ObjectId to string for JSON serialization
    for booking in bookings:
        booking["_id"] = str(booking["_id"])  # ✅ Convert ObjectId to string
        booking["booking_id"] = booking["_id"]  # Keep booking_id for consistency

    return bookings