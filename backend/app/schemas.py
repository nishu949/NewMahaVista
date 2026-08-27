# app/schemas.py
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import date, datetime
from typing import List, Optional
from bson import ObjectId

# Helper for ObjectId serialization
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

# ========== User Schemas ==========
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    full_name: str
    email: EmailStr
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

# ========== Product Schemas ==========
class ProductResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    price: float
    image: Optional[str] = None
    category: Optional[str] = None
    stock: int
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

# ========== Question Schemas ==========
class QuestionResponse(BaseModel):
    id: str = Field(alias="_id")
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: int
    category: str
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

# ========== City Embedded Schemas ==========
class PlaceOut(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None

class CultureOut(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    image: Optional[str] = None

class StayOut(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    amenities: Optional[str] = None
    booking_link: Optional[str] = None

class TransportOut(BaseModel):
    type: str
    title: str
    description: Optional[str] = None

# ========== City Schemas ==========
class CityResponse(BaseModel):
    id: str = Field(alias="_id")
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
    places: List[PlaceOut] = []
    culture: List[CultureOut] = []
    stays: List[StayOut] = []
    transport: List[TransportOut] = []
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class CityPlannerOut(CityResponse):
    """Alias for CityResponse for backward compatibility"""
    pass

# ========== Trip Inquiry Schemas ==========
class TripInquiryCreate(BaseModel):
    full_name: str
    email: EmailStr
    travel_date: date
    guests: int
    special_interests: Optional[str] = None

class TripInquiryResponse(BaseModel):
    message: str


# ========== Booking Schemas ==========

class BookingCreate(BaseModel):
    city: str
    experience: str
    travel_date: date
    travellers: int

    user_id: str

    full_name: str
    email: EmailStr
    phone: str
    from_city: str

    special_requests: Optional[str] = None


class BookingResponse(BaseModel):
    message: str
    booking_id: str
    status: str

# ========== Story Schemas ==========
class StoryResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    city: str
    category: str
    duration: str
    thumbnail: str
    description: Optional[str] = None
    video_url: str
    is_featured: bool
    view_count: int
    likes: int
    age_group: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class StoryCreate(BaseModel):
    title: str
    city: str
    category: str
    duration: str
    thumbnail: str
    description: Optional[str] = None
    video_url: str
    is_featured: bool = False
    age_group: str = "All"
    tags: List[str] = []

class StoryUpdate(BaseModel):
    title: Optional[str] = None
    city: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    thumbnail: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    is_featured: Optional[bool] = None
    age_group: Optional[str] = None
    tags: Optional[List[str]] = None

class StoriesResponse(BaseModel):
     
    stories: List[StoryResponse]
    pagination: dict
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)


# ========== Admin Schemas ==========

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str = "admin"

class AdminResponse(BaseModel):
    id: str = Field(alias="_id")
    username: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class AdminUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

# ========== Admin Dashboard Stats ==========

class DashboardStats(BaseModel):
    total_users: int
    total_bookings: int
    total_cities: int
    total_revenue: float
    pending_bookings: int
    confirmed_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    recent_bookings: List[dict]
    bookings_by_city: List[dict]
    monthly_revenue: List[dict]

# ========== Admin Booking Update ==========

class AdminBookingUpdate(BaseModel):
    status: str  # pending, confirmed, completed, cancelled