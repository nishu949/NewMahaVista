from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from typing import Optional, List
import bcrypt
import jwt
from bson import ObjectId

from ..database import mongo_db, get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/admin", tags=["Admin"])
security = HTTPBearer()

# Secret key - move to environment variables in production
SECRET_KEY = "your-super-secret-admin-key-change-this"
ALGORITHM = "HS256"

# ================= HELPER FUNCTIONS =================

def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    plain_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def create_admin_token(email: str) -> str:
    """Create JWT token for admin"""
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current admin from token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        
        if email is None or role != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        admin = mongo_db["admins"].find_one({"email": email, "is_active": True})
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin not found or inactive"
            )
        
        return admin
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# ================= ADMIN AUTH =================

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_admin(admin_data: schemas.AdminRegister, db=Depends(get_db)):
    """Register a new admin"""
    # Check if admin exists
    existing = mongo_db["admins"].find_one({"email": admin_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this email already exists"
        )
    
    # Check if username exists
    existing_username = mongo_db["admins"].find_one({"username": admin_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create admin
    admin_doc = {
        "username": admin_data.username,
        "email": admin_data.email,
        "password": hash_password(admin_data.password),
        "full_name": admin_data.full_name,
        "role": admin_data.role,
        "is_super_admin": False,
        "is_active": True,
        "permissions": ["manage_bookings", "manage_users", "manage_cities"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = mongo_db["admins"].insert_one(admin_doc)
    
    return {
        "message": "Admin registered successfully",
        "admin_id": str(result.inserted_id)
    }

@router.post("/login")
async def login_admin(login_data: schemas.AdminLogin, db=Depends(get_db)):
    """Login as admin"""
    admin = mongo_db["admins"].find_one({"email": login_data.email})

    print("=" * 50)
    print(f"🔍 Looking for admin with email: {login_data.email}")
    print(f"found: {admin is not None}")
    if admin:
        print(f"Password hash: {admin['password']}")
        print(f"Input password: {login_data.password}")
    print("=" * 50)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not admin.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is deactivated"
        )
    
    if not verify_password(login_data.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Update last login
    mongo_db["admins"].update_one(
        {"_id": admin["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    token = create_admin_token(login_data.email)
    
    return {
        "message": "Login successful",
        "token": token,
        "admin": {
            "id": str(admin["_id"]),
            "username": admin["username"],
            "email": admin["email"],
            "full_name": admin["full_name"],
            "role": admin.get("role", "admin")
        }
    }

@router.get("/me")
async def get_admin_profile(admin: dict = Depends(get_current_admin)):
    """Get current admin profile"""
    admin["_id"] = str(admin["_id"])
    return admin

@router.post("/logout")
async def logout_admin():
    """Logout admin (client side token removal)"""
    return {"message": "Logout successful"}

# ================= DASHBOARD STATS =================

@router.get("/dashboard")
async def get_dashboard_stats(admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    
    # Get counts
    total_users = mongo_db["users"].count_documents({})
    total_bookings = mongo_db["bookings"].count_documents({})
    total_cities = mongo_db["cities"].count_documents({})
    
    # Booking status counts
    pending = mongo_db["bookings"].count_documents({"status": "pending"})
    confirmed = mongo_db["bookings"].count_documents({"status": "confirmed"})
    completed = mongo_db["bookings"].count_documents({"status": "completed"})
    cancelled = mongo_db["bookings"].count_documents({"status": "cancelled"})
    
    # Total revenue
    revenue_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = list(mongo_db["bookings"].aggregate(revenue_pipeline))
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    # Recent bookings (last 10)
    recent_bookings = list(
        mongo_db["bookings"]
        .find()
        .sort("created_at", -1)
        .limit(10)
    )
    
    # ✅ FIX: Convert ObjectId to string
    for booking in recent_bookings:
        booking["_id"] = str(booking["_id"])
    
    # Bookings by city
    city_pipeline = [
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    bookings_by_city = list(mongo_db["bookings"].aggregate(city_pipeline))
    
    # Monthly revenue (last 6 months)
    monthly_revenue = list(
        mongo_db["bookings"].aggregate([
            {
                "$match": {
                    "created_at": {"$gte": datetime.utcnow() - timedelta(days=180)}
                }
            },
            {
                "$group": {
                    "_id": {"$month": "$created_at"},
                    "revenue": {"$sum": "$total"}
                }
            },
            {"$sort": {"_id": 1}}
        ])
    )
    
    return {
        "total_users": total_users,
        "total_bookings": total_bookings,
        "total_cities": total_cities,
        "total_revenue": total_revenue,
        "pending_bookings": pending,
        "confirmed_bookings": confirmed,
        "completed_bookings": completed,
        "cancelled_bookings": cancelled,
        "recent_bookings": recent_bookings,
        "bookings_by_city": bookings_by_city,
        "monthly_revenue": monthly_revenue
    }
# ================= MANAGE BOOKINGS =================

@router.get("/bookings")
async def get_all_bookings(
    status: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0),
    admin: dict = Depends(get_current_admin)
):
    """Get all bookings with filters"""
    query = {}
    if status:
        query["status"] = status
    if city:
        query["city"] = city
    
    bookings = list(
        mongo_db["bookings"]
        .find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    
    for booking in bookings:
        booking["_id"] = str(booking["_id"])
    
    total = mongo_db["bookings"].count_documents(query)
    
    return {
        "bookings": bookings,
        "total": total,
        "limit": limit,
        "skip": skip
    }

@router.get("/bookings/{booking_id}")
async def get_booking_details(booking_id: str, admin: dict = Depends(get_current_admin)):
    """Get booking details by ID"""
    try:
        booking = mongo_db["bookings"].find_one({"_id": ObjectId(booking_id)})
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        booking["_id"] = str(booking["_id"])
        return booking
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

@router.put("/bookings/{booking_id}")
async def update_booking_status(
    booking_id: str,
    update_data: schemas.AdminBookingUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Update booking status"""
    try:
        result = mongo_db["bookings"].update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"status": update_data.status, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        return {"message": f"Booking status updated to {update_data.status}"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

@router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a booking"""
    try:
        result = mongo_db["bookings"].delete_one({"_id": ObjectId(booking_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        return {"message": "Booking deleted successfully"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

# ================= MANAGE USERS =================

@router.get("/users")
async def get_all_users(
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0),
    admin: dict = Depends(get_current_admin)
):
    """Get all users with search"""
    query = {}
    if search:
        query["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    
    users = list(
        mongo_db["users"]
        .find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    
    for user in users:
        user["_id"] = str(user["_id"])
        # Remove password from response
        user.pop("password", None)
    
    total = mongo_db["users"].count_documents(query)
    
    return {
        "users": users,
        "total": total,
        "limit": limit,
        "skip": skip
    }

@router.get("/users/{user_id}")
async def get_user_details(user_id: str, admin: dict = Depends(get_current_admin)):
    """Get user details by ID"""
    try:
        user = mongo_db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        
        # Get user's bookings
        bookings = list(
            mongo_db["bookings"]
            .find({"email": user["email"]})
            .sort("created_at", -1)
        )
        
        for booking in bookings:
            booking["_id"] = str(booking["_id"])
        
        return {"user": user, "bookings": bookings}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a user"""
    try:
        result = mongo_db["users"].delete_one({"_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "User deleted successfully"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )

# ================= MANAGE CITIES =================

@router.get("/cities")
async def get_all_cities_admin(
    admin: dict = Depends(get_current_admin)
):
    """Get all cities for admin"""
    cities = list(mongo_db["cities"].find().sort("name", 1))
    
    for city in cities:
        city["_id"] = str(city["_id"])
        # Get booking count for each city
        city["booking_count"] = mongo_db["bookings"].count_documents({"city": city["name"]})
    
    return cities

@router.post("/cities")
async def create_city(
    city_data: dict,
    admin: dict = Depends(get_current_admin)
):
    """Create a new city"""
    # Check if city already exists
    existing = mongo_db["cities"].find_one({"slug": city_data.get("slug")})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City with this slug already exists"
        )
    
    city_data["created_at"] = datetime.utcnow()
    city_data["updated_at"] = datetime.utcnow()
    city_data["places"] = city_data.get("places", [])
    city_data["culture"] = city_data.get("culture", [])
    city_data["stays"] = city_data.get("stays", [])
    city_data["transport"] = city_data.get("transport", [])
    
    result = mongo_db["cities"].insert_one(city_data)
    
    return {
        "message": "City created successfully",
        "city_id": str(result.inserted_id)
    }

@router.put("/cities/{city_id}")
async def update_city(
    city_id: str,
    city_data: dict,
    admin: dict = Depends(get_current_admin)
):
    """Update a city"""
    try:
        city_data["updated_at"] = datetime.utcnow()
        
        result = mongo_db["cities"].update_one(
            {"_id": ObjectId(city_id)},
            {"$set": city_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="City not found"
            )
        
        return {"message": "City updated successfully"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid city ID"
        )

@router.delete("/cities/{city_id}")
async def delete_city(city_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a city"""
    try:
        result = mongo_db["cities"].delete_one({"_id": ObjectId(city_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="City not found"
            )
        
        return {"message": "City deleted successfully"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid city ID"
        )