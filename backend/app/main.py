# app/main.py
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
import os

from .database import mongo_db, get_db
from . import schemas, crud
from .routes import story_routes
from .routes import recommendation_routes
from .routes import destination_routes
from .routes import admin_routes  # ✅ IMPORT ADMIN ROUTES

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:8000",
        "http://localhost:8010",
        "http://127.0.0.1:8010",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= STATIC FILES =================
# Serve videos from frontend public folder
videos_path = "../frontend/public/videos"
if os.path.exists(videos_path):
    app.mount("/videos", StaticFiles(directory=videos_path), name="videos")
    print(f"✅ Videos served from: {videos_path}")
else:
    print(f"⚠️  Videos folder not found: {videos_path}")

# ================= ROUTERS =================
app.include_router(story_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(destination_routes.router)
app.include_router(admin_routes.router)  # ✅ ADD ADMIN ROUTER

# ================= STARTUP =================
@app.on_event("startup")
async def startup_db_client():
    """Create indexes for better performance"""
    print("Creating MongoDB indexes...")
    try:
        # User indexes
        mongo_db["users"].create_index("email", unique=True)
        mongo_db["users"].create_index("full_name")
        
        # Product indexes
        mongo_db["products"].create_index("name")
        mongo_db["products"].create_index("category")
        
        # Question indexes
        mongo_db["questions"].create_index("category")
        
        # City indexes
        mongo_db["cities"].create_index("slug", unique=True)
        mongo_db["cities"].create_index("name")
        
        # Trip inquiry indexes
        mongo_db["trip_inquiries"].create_index("city_id")
        mongo_db["trip_inquiries"].create_index("email")
        mongo_db["trip_inquiries"].create_index("created_at")

        # Booking indexes
        mongo_db["bookings"].create_index("email")
        mongo_db["bookings"].create_index("city")
        mongo_db["bookings"].create_index("travel_date")
        mongo_db["bookings"].create_index("created_at")
        
        # Admin indexes
        mongo_db["admins"].create_index("email", unique=True)
        mongo_db["admins"].create_index("username", unique=True)
        
        print("✅ MongoDB indexes created")
    except Exception as e:
        print(f"⚠️  Index creation warning: {e}")

# ========== Root ==========
@app.get("/")
def root():
    return {"message": "FastAPI backend is running with MongoDB"}

# ========== Users ==========
@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserRegister, db=Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, user)
    return new_user

@app.post("/login")
def login(user: schemas.UserLogin, db=Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not crud.verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": "Login successful",
        "user": {
            "id": db_user["_id"],
            "full_name": db_user["full_name"],
            "email": db_user["email"]
        }
    }

# ========== Products ==========
@app.get("/products", response_model=list[schemas.ProductResponse])
def get_products(db=Depends(get_db)):
    return crud.get_all_products(db)

@app.get("/products/category/{category}", response_model=list[schemas.ProductResponse])
def get_products_by_category(category: str, db=Depends(get_db)):
    products = list(mongo_db["products"].find({"category": category}))
    for product in products:
        product["_id"] = str(product["_id"])
    return products

# ========== Questions ==========
@app.get("/questions", response_model=list[schemas.QuestionResponse])
def get_questions(category: Optional[str] = Query(None), db=Depends(get_db)):
    query = {}
    if category:
        query["category"] = category
    questions = list(mongo_db["questions"].find(query))
    for question in questions:
        question["_id"] = str(question["_id"])
    return questions

# ========== Cities ==========
@app.get("/api/cities", response_model=list[schemas.CityResponse])
def get_all_cities(db=Depends(get_db)):
    cities = list(mongo_db["cities"].find())
    for city in cities:
        city["_id"] = str(city["_id"])
    return cities

@app.get("/api/cities/{slug}", response_model=schemas.CityResponse)
def get_city_by_slug(slug: str, db=Depends(get_db)):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    city["_id"] = str(city["_id"])
    return city

@app.get("/api/cities/{slug}/planner", response_model=schemas.CityPlannerOut)
def get_city_planner(slug: str, db=Depends(get_db)):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    city["_id"] = str(city["_id"])
    return city

@app.get("/api/cities/{slug}/places")
def get_city_places(slug: str, db=Depends(get_db)):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city.get("places", [])

@app.get("/api/cities/{slug}/culture")
def get_city_culture(slug: str, db=Depends(get_db)):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city.get("culture", [])

@app.get("/api/cities/{slug}/stays")
def get_city_stays(slug: str, db=Depends(get_db)):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city.get("stays", [])

@app.get("/api/cities/{slug}/transport")
def get_city_transport(slug: str, db=Depends(get_db)):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city.get("transport", [])

# ========== Trip Inquiries ==========
@app.post("/api/cities/{slug}/trip-inquiry", response_model=schemas.TripInquiryResponse)
def submit_trip_inquiry(
    slug: str,
    payload: schemas.TripInquiryCreate,
    db=Depends(get_db),
):
    city = mongo_db["cities"].find_one({"slug": slug})
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    crud.create_trip_inquiry(db, str(city["_id"]), payload)
    return {"message": "Trip inquiry submitted successfully"}

# ========== Test DB ==========
@app.get("/test-db")
def test_db_connection():
    try:
        mongo_db.command("ping")
        collections = mongo_db.list_collection_names()
        return {
            "status": "Connected to MongoDB",
            "database": "mystic_trails",
            "collections": collections
        }
    except Exception as e:
        return {
            "status": "Error connecting to MongoDB",
            "error": str(e)
        }

# ========== Bookings ==========
@app.post("/api/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate, db=Depends(get_db)):
    # Pricing based on selected experience
    if booking.experience == "Local Experience":
        price = 1999
    elif booking.experience == "Heritage Experience":
        price = 2499
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid experience selected"
        )

    # Calculate pricing
    experience_cost = price * booking.travellers
    taxes = 200
    service_fee = 99
    total = experience_cost + taxes + service_fee

    # Save booking
    result = crud.create_booking(db, booking, price, taxes, service_fee, total)

    return {
        "message": "Booking created successfully",
        "booking_id": result["booking_id"],
        "status": result["status"]
    }

# ========== Get User Bookings ==========
@app.get("/api/bookings")
def get_user_bookings(
    email: str = Query(..., description="User email to fetch bookings for"),
    db=Depends(get_db)
):
    bookings = crud.get_bookings_by_email(db, email)
    return bookings