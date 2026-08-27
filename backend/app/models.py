# app/models.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

# Custom type for MongoDB ObjectId (DEFINED ONLY ONCE)
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Base MongoDB Document Model
class MongoBase(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ========== User Model ==========
class User(MongoBase):
    full_name: str
    email: EmailStr
    password: str  # Hashed password

# ========== Product Model ==========
class Product(MongoBase):
    name: str
    description: str
    price: float
    image: Optional[str] = None
    category: Optional[str] = None
    stock: int = 0

# ========== Question Model ==========
class Question(MongoBase):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: int
    category: str

# ========== Embedded Documents for City ==========
class Place(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None

class Culture(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    image: Optional[str] = None

class Stay(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    amenities: Optional[str] = None
    booking_link: Optional[str] = None

class Transport(BaseModel):
    type: str  # road, rail, air
    title: str
    description: Optional[str] = None

# ========== City Model ==========
class City(MongoBase):
    name: str
    slug: str
    tagline: Optional[str] = None
    subtitle: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    details: Optional[str] = None
    detail_image: Optional[str] = None
    best_time: Optional[str] = None
    highlights: Optional[str] = None
    budget: Optional[str] = None
    duration: Optional[str] = None
    
    # Embedded documents
    places: List[Place] = []
    culture: List[Culture] = []
    stays: List[Stay] = []
    transport: List[Transport] = []

# ========== Trip Inquiry Model ==========
class TripInquiry(MongoBase):
    city_id: Optional[str] = None
    city_slug: Optional[str] = None
    full_name: str
    email: EmailStr
    travel_date: datetime
    guests: int
    special_interests: Optional[str] = None

# ========== Story Model ==========
class StoryVideoMetadata(BaseModel):
    format: Optional[str] = None
    size: Optional[int] = None
    duration: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None

class Story(MongoBase):
    title: str
    city: str
    category: str  # Heritage, Culture, Festivals, Food, Wildlife
    duration: str
    thumbnail: str
    description: Optional[str] = None
    video_url: str
    video_public_id: Optional[str] = None
    video_metadata: Optional[StoryVideoMetadata] = None
    is_featured: bool = False
    view_count: int = 0
    likes: int = 0
    age_group: str = "All"  # Kids, Students, All
    tags: List[str] = []

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


# ========== Admin Model ==========
class Admin(MongoBase):
    username: str
    email: EmailStr
    password: str  # Hashed password
    full_name: str
    is_super_admin: bool = False
    is_active: bool = True
    last_login: Optional[datetime] = None
    role: str = "admin"  # admin, super_admin
    permissions: List[str] = []  # ['manage_bookings', 'manage_users', 'manage_cities']