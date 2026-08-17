import json
from datetime import datetime
from app.database import mongo_db

def seed_stories():
    print("📽️ Seeding stories to MongoDB Atlas...")
    
    stories_collection = mongo_db["stories"]
    stories_collection.delete_many({})
    
    stories = [

           {
                    "title": "Maharashtra: The Land of Culture and Heritage",
                    "city": "Maharashtra",
                    "category": "Culture",
                    "duration": "2 min",
                    "thumbnail": "🏛️",
                    "description": "Explore the rich cultural heritage of Maharashtra, the Oxford of the East",
                    "video_url": "..\\public\\videos\\IntroVideo.mp4",
                    "is_featured": True,
                    "view_count": 1250,
                    "tags": ["culture", "heritage", "education"]
                },
        {
            "title": "Pune: The Cultural Heart of Maharashtra",
            "city": "Pune",
            "category": "Culture",
            "duration": "2 min",
            "thumbnail": "🏛️",
            "description": "Explore the rich cultural heritage of Pune, the Oxford of the East",
            "video_url": "..\\public\\videos\\punevideo.mp4",
            "is_featured": True,
            "view_count": 1250,
            "tags": ["culture", "heritage", "education"]
        },
        {
            "title": "Shaniwar Wada Story",
            "city": "Pune",
            "category": "Heritage",
            "duration": "1 min",
            "thumbnail": "🏰",
            "description": "The historic fort of the Maratha Empire",
            "video_url": "..\\public\\videos\\shaniwarwada.mp4",
            "is_featured": False,
            "view_count": 890,
            "tags": ["heritage", "fort", "maratha"]
        },
        {
            "title": "Ganesh Festival Story",
            "city": "Pune",
            "category": "Festivals",
            "duration": "50 sec",
            "thumbnail": "🐘",
            "description": "The vibrant celebration of Lord Ganesh",
            "video_url": "..\\public\\videos\\ganeshfestival.mp4",
            "is_featured": False,
            "view_count": 2100,
            "tags": ["festival", "ganesh", "celebration"]
        },
        {
            "title": "Mumbai: City of Dreams",
            "city": "Mumbai",
            "category": "Culture",
            "duration": "3 min",
            "thumbnail": "🌆",
            "description": "Discover the bustling metropolis and its rich cultural diversity",
            "video_url": "..\\public\\videos\\mumbaivideo   .mp4",
            "is_featured": True,
            "view_count": 3400,
            "tags": ["mumbai", "culture", "city"]
        },
        {
            "title": "Nashik: The Sacred City",
            "city": "Nashik",
            "category": "Heritage",
            "duration": "2.5 min",
            "thumbnail": "🛕",
            "description": "Explore the spiritual heart of Maharashtra",
            "video_url": "https://res.cloudinary.com/demo/video/upload/v1/sample5.mp4",
            "is_featured": True,
            "view_count": 560,
            "tags": ["nashik", "temple", "spiritual"]
        },
        {
            "title": "Maharashtrian Cuisine Journey",
            "city": "Pune",
            "category": "Food",
            "duration": "2 min",
            "thumbnail": "🍛",
            "description": "Explore the diverse and flavorful cuisine of Maharashtra",
            "video_url": "https://res.cloudinary.com/demo/video/upload/v1/sample6.mp4",
            "is_featured": False,
            "view_count": 780,
            "tags": ["food", "cuisine", "maharashtra"]
        }
    ]
    
    # Add timestamps
    for story in stories:
        story["created_at"] = datetime.utcnow()
        story["updated_at"] = datetime.utcnow()
    
    result = stories_collection.insert_many(stories)
    print(f"✅ Seeded {len(result.inserted_ids)} stories")
    
    # Show sample
    sample = stories_collection.find_one({"city": "Pune"})
    if sample:
        print(f"\n📊 Sample story:")
        print(f"   Title: {sample['title']}")
        print(f"   City: {sample['city']}")
        print(f"   Category: {sample['category']}")
        print(f"   Views: {sample['view_count']}")

if __name__ == "__main__":
    seed_stories()