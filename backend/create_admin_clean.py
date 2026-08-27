# create_admin_clean.py
import bcrypt
from pymongo import MongoClient
from datetime import datetime

# YOUR ATLAS CONNECTION STRING
ATLAS_URI = "mongodb+srv://devnahire_db_user:mahavista%40123@mahavista.etebw7w.mongodb.net/?appName=MahaVista"
DB_NAME = "mystic_trails"  # Change to your database name

print("📡 Connecting to MongoDB Atlas...")
client = MongoClient(ATLAS_URI)
db = client[DB_NAME]

# Delete old admin
db.admins.delete_many({"email": "admin@mystictrails.com"})
print("🗑️  Deleted old admin")

# Hash password
password = "admin123"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
hashed_password = hashed.decode('utf-8')

print(f"🔐 New password hash: {hashed_password}")

# Verify the hash works
test = bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
print(f"✅ Hash verification test: {'PASSED' if test else 'FAILED'}")

# Create admin
admin = {
    "username": "admin",
    "email": "admin@mystictrails.com",
    "password": hashed_password,
    "full_name": "Super Admin",
    "role": "super_admin",
    "is_super_admin": True,
    "is_active": True,
    "permissions": ["manage_bookings", "manage_users", "manage_cities"],
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}

result = db.admins.insert_one(admin)
print(f"✅ Admin created with ID: {result.inserted_id}")
print("=" * 50)
print("📧 Email: admin@mystictrails.com")
print("🔑 Password: admin123")
print("=" * 50)