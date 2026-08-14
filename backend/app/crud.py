# crud.py
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from passlib.context import CryptContext
from .database import (
    users_collection,
    products_collection,
    questions_collection,
    cities_collection,
    trip_inquiries_collection,
    serialize_doc,
    serialize_list
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ========== Password Utilities ==========
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

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


def create_booking(db, booking_data, price, taxes, service_fee, total):
    booking = {
        "city": booking_data.city,
        "experience": booking_data.experience,
        "travel_date": booking_data.travel_date.isoformat(),
        "travellers": booking_data.travellers,

        # Traveller information
        "full_name": booking_data.full_name,
        "email": booking_data.email,
        "phone": booking_data.phone,
        "from_city": booking_data.from_city,
        "special_requests": booking_data.special_requests,

        # Pricing
        "price_per_person": price,
        "taxes": taxes,
        "service_fee": service_fee,
        "total": total,

        # Booking status
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    result = db["bookings"].insert_one(booking)

    return {
        "booking_id": str(result.inserted_id),
        "status": "pending"
    }

# ========== User Bookings ==========

def get_bookings_by_email(db, email: str):
    """Get all bookings made by a user using their email"""

    bookings = list(
        db["bookings"]
        .find({"email": email})
        .sort("created_at", -1)
    )

    return serialize_list(bookings)