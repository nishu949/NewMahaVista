# database.py
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

print("Looking for .env at:", ENV_PATH)
print("Exists:", ENV_PATH.exists())

load_dotenv(dotenv_path=ENV_PATH)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

print("MONGO_URI =", MONGO_URI[:30] + "..." if MONGO_URI else "Not set")
print("MONGO_DB_NAME =", MONGO_DB_NAME)

if not all([MONGO_URI, MONGO_DB_NAME]):
    raise ValueError(
        f"Missing env values -> MONGO_URI={MONGO_URI}, MONGO_DB_NAME={MONGO_DB_NAME}"
    )

# MongoDB Client
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client[MONGO_DB_NAME]

# Collection references (like tables in SQL)
users_collection = mongo_db["users"]
products_collection = mongo_db["products"]
questions_collection = mongo_db["questions"]
cities_collection = mongo_db["cities"]
trip_inquiries_collection = mongo_db["trip_inquiries"]

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

def serialize_list(docs):
    """Convert list of MongoDB documents to JSON serializable format"""
    return [serialize_doc(doc) for doc in docs]

def get_db():
    """Get MongoDB database instance"""
    return mongo_db