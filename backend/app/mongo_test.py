# mongo_test.py
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

print("=" * 50)
print("MongoDB Atlas Connection Test")
print("=" * 50)

try:
    print(f"\n📡 Connecting to: {MONGO_DB_NAME}")
    print(f"📍 URI: {MONGO_URI[:30]}...")
    
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )
    
    print("⏳ Pinging server...")
    client.admin.command("ping")
    
    # Test database access
    db = client[MONGO_DB_NAME]
    collections = db.list_collection_names()
    
    print("\n✅ MongoDB Atlas Connected Successfully!")
    print(f"📚 Database: {MONGO_DB_NAME}")
    print(f"📁 Collections: {collections if collections else 'No collections yet'}")
    
    # Test write operation
    test_collection = db["test_connection"]
    test_collection.insert_one({"test": "connection", "timestamp": "2026-01-23"})
    test_collection.delete_many({})
    print("✅ Write operation successful!")
    
    print("\n" + "=" * 50)
    print("✅ All tests passed! Your MongoDB connection is working.")
    print("=" * 50)

except Exception as e:
    print("\n❌ Connection Failed")
    print(f"Error Type: {type(e).__name__}")
    print(f"Error: {e}")
    print("\nPlease check:")
    print("1. Your internet connection")
    print("2. MongoDB Atlas cluster is active")
    print("3. IP address is whitelisted in MongoDB Atlas")
    print("4. Username and password are correct")