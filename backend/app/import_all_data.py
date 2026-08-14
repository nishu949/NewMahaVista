# import_all_data.py
import json
import os
from pathlib import Path
from datetime import datetime
from app.database import mongo_db

def import_all_data():
    """Import all data from JSON files into MongoDB"""
    
    print("=" * 70)
    print("🚀 Importing All Data to MongoDB")
    print("=" * 70)
    
    # Clear existing data (optional - be careful!)
    response = input("\n⚠️  This will replace existing data. Continue? (yes/no): ")
    if response.lower() != "yes":
        print("❌ Import cancelled.")
        return
    
    # Get all collections
    cities_collection = mongo_db["cities"]
    products_collection = mongo_db["products"]
    questions_collection = mongo_db["questions"]
    
    # Clear existing data
    cities_collection.delete_many({})
    products_collection.delete_many({})
    questions_collection.delete_many({})
    print("🗑️  Cleared existing data")
    
    # ========== Import Cities ==========
    print("\n📥 Importing Cities...")
    cities_data = [
        {
            "name": "Nashik",
            "slug": "nashik",
            "tagline": "The Wine & Spiritual Capital",
            "subtitle": "Spiritual & Viticultural Soul",
            "image": "/images/NashikCity.jpeg",
            "description": "Divine & Scenic Blend",
            "details": "Nashik, located in Maharashtra, India, is a city rich in history, culture, and spirituality, known for its vineyards, temples, and the Kumbh Mela festival.Geographical Significance",
            "detail_image": "/images/Nashik2.jpg",
            "best_time": "Oct - Mar",
            "highlights": "Temples & Grapes",
            "budget": "₹₹ - ₹₹₹",
            "duration": "3-4 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Pune",
            "slug": "pune",
            "tagline": "Oxford of the East",
            "subtitle": "Cultural Capital",
            "image": "/images/PuneCity.jpeg",
            "description": "Modern & Historic",
            "details": "Pune is a sprawling city in the western Indian state of Maharashtra. It was once the base of the Peshwas (prime ministers) of the Maratha Empire, which lasted from 1674 to 1818. It's known for the grand Aga Khan Palace, built in 1892 and now a memorial t...",
            "detail_image": "/images/Pune2.jpg",
            "best_time": "Oct - Feb",
            "highlights": "Forts & Food",
            "budget": "₹₹",
            "duration": "2-3 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Mumbai",
            "slug": "mumbai",
            "tagline": "City of Dreams",
            "subtitle": "Urban Energy",
            "image": "/images/MumbaiCity.jpeg",
            "description": "Never Sleeps",
            "details": "Mumbai (also known as Bombay, the official name until 1995) is the capital city of the Indian state of Maharashtra. Mumbai lies on the Konkan coast on the west coast of India and has a deep natural harbour. In 2008, Mumbai was named an alpha world city.",
            "detail_image": "/images/Mumbai2.jpg",
            "best_time": "Nov - Feb",
            "highlights": "Sea & City",
            "budget": "₹₹₹",
            "duration": "2-3 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Nagpur",
            "slug": "nagpur",
            "tagline": "Orange City",
            "subtitle": "Heart of India",
            "image": "/images/NagpurCity.jpg",
            "description": "Central Charm",
            "details": "Nagpur is a large city in the central Indian state of Maharashtra. The 19th-century Nagpur Central Museum displays items found locally, including fossils, sarcophagi and Mughal weaponry. The Raman Science Centre has hands-on exhibits and a planetarium. S...",
            "detail_image": "/images/Nagpur.jpg",
            "best_time": "Oct - Feb",
            "highlights": "Nature & Wildlife",
            "budget": "₹₹",
            "duration": "2 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Kolhapur",
            "slug": "kolhapur",
            "tagline": "Royal Heritage",
            "subtitle": "Cultural Depth",
            "image": "/images/KolhapurCity.png",
            "description": "Tradition & Taste",
            "details": "Kolhapur is a city on the banks of the Panchaganga River, in the west Indian state of Maharashtra. It’s known for its temples, like the ancient Mahalakshmi Temple, a Hindu pilgrimage site. The Bhavani Mandap is an imposing old palace with a small museu...",
            "detail_image": "/images/KolhapurCity.png",
            "best_time": "Oct - Mar",
            "highlights": "Food & Heritage",
            "budget": "₹₹",
            "duration": "2-3 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Yavatmal",
            "slug": "yavatmal",
            "tagline": "Cultural Land",
            "subtitle": "Explore traditions",
            "image": "/images/YavatmalCity.png",
            "description": "About Yavatmal",
            "details": "Yavatmal is a city and municipal council in the Indian state of Maharashtra. It is the administrative headquarters of Yavatmal District. Yavatmal is around 90 km away from divisional headquarters Amravati while it is 670 km away from the state capital Mu...",
            "detail_image": "/images/Yavatmal.jpg",
            "best_time": "Oct-Feb",
            "highlights": "Culture",
            "budget": "₹8k-15k",
            "duration": "2-3 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Gadchiroli",
            "slug": "gadchiroli",
            "tagline": "Forest District",
            "subtitle": "Nature & wildlife",
            "image": "/images/GadchiroliCity.jpg",
            "description": "About Gadchiroli",
            "details": "Dense forest and greenery in the region attracts trackers of the area. Stones in the area are rich with iron ore. The government also trying to establish iron mines in this area. It is famous for its natural beauty.",
            "detail_image": "/images/Gadchiroli.jpg",
            "best_time": "Nov-Feb",
            "highlights": "Nature",
            "budget": "₹7k-14k",
            "duration": "2-3 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        },
        {
            "name": "Amravati",
            "slug": "amravati",
            "tagline": "Historic Region",
            "subtitle": "Temples & heritage",
            "image": "/images/AmravatiCity.jpg",
            "description": "About Amravati",
            "details": "Amravati is a city in Maharashtra located in the Vidarbha region. It is the ninth largest city in Maharashtra, India & second largest city in the Vidarbha region in terms of population",
            "detail_image": "/images/Amravati.jpg",
            "best_time": "Oct-Mar",
            "highlights": "Heritage",
            "budget": "₹9k-16k",
            "duration": "2-3 Days",
            "places": [],
            "culture": [],
            "stays": [],
            "transport": []
        }
    ]
    
    # Insert cities
    for city in cities_data:
        city['created_at'] = datetime.utcnow()
        city['updated_at'] = datetime.utcnow()
        cities_collection.update_one(
            {"slug": city['slug']},
            {"$set": city},
            upsert=True
        )
    print(f"✅ Imported {len(cities_data)} cities")
    
    # ========== Import Places ==========
    print("\n📥 Importing Places...")
    places_data = [
        {"city_id": 1, "title": "Trimbakeshwar Temple", "description": "Trimbakeshwar Shiva Temple is an ancient Hindu temple in the town of Trimbak, in the Trimbakeshwar tehsil, in the Nashik District of Maharashtra, India, 28 km from the city of Nashik and 40 km from Nashik road.", "image": "/images/TrambakTemple.jpg"},
        {"city_id": 1, "title": "Sula Vineyards", "description": "Sula Vineyards is a winery and vineyard located in the Nashik region of western India, approximately 180 kilometres northeast of Mumbai. It was founded by Rajeev Samant in 1999. Sula has grown to be India's largest and most awarded wine brand", "image": "/images/SulaVines.jpg"},
        {"city_id": 2, "title": "Shaniwar Wada", "description": "Shaniwar Wada is a historical fortification in the city of Pune, India. Built in 1732, it was the seat of the Peshwas of the Maratha Confederacy until 1818. The fort itself was largely destroyed in 1828 by an unexplained fire, but the surviving structure...", "image": "/images/ShaniwarWada.jpg"},
        {"city_id": 2, "title": "Sinhagad Fort", "description": "Sinhagad is an ancient hill fortress located at around 28 kilometres southwest of the city of Pune, India. Previously known as Kondhana, the fort has been the site of many battles, most notably the Battle of Sinhagad in 1670. The fort is a popular weeken...", "image": "/images/SinhagadFort.jpg"},
        {"city_id": 3, "title": "Gateway of India", "description": "The Gateway of India is an arch-monument, completed in 1924, on the waterfront of Mumbai, Maharashtra, India. It was erected to commemorate the landing of King George V of the United Kingdom for his coronation as the Emperor of India in December 1911 at ...", "image": "/images/GatewayIndia.jpg"},
        {"city_id": 3, "title": "Marine Drive", "description": "Marine Drive, often referred to as the Queen's Necklace, is a 3-kilometre-long promenade along the Netaji Subhash Chandra Bose Road in Mumbai, India. The road and promenade were constructed by Pallonji Mistry in 1940. It is a banana-shaped, six-lane conc...", "image": "/images/MarineDrive.jpg"},
        {"city_id": 4, "title": "Deekshabhoomi", "description": "Deekshabhoomi means the ground where people got ordained as Buddhist. This religious mass conversion at one place was the first ever of its kind in history. Deekshabhoomi is one of two places of considered to be of great importance in the life of Ambedka...", "image": "/images/Deekshabhoomi.jpg"},
        {"city_id": 4, "title": "Pench National Park", "description": "Pench National Park is a national park in the Indian state of Madhya Pradesh. It was created in 1983 with an area of 292.85 km² in the Seoni and Chhindwara districts. Since 1992, the park has formed part of the core of the Pench Tiger Reserve, together ...", "image": "/images/PenchPark.jpg"},
        {"city_id": 5, "title": "Mahalaxmi Temple", "description": "The temple is easily accessible, and devotees believe that Goddess Mahalaxmi's blessings bring prosperity and well-being to the entire area. Goddess Mahalaxmi is believed to reside at this sacred place along with her two sisters, Mahakali and Mahasaraswa...", "image": "/images/MahalaxmiTemple.jpg"},
        {"city_id": 5, "title": "Panhala Fort", "description": "The fort of Panhala occupies a prime place in the history of Maharashtra and is also a favourite destination as a hill station. Built by the Shilahara dynasty of Kolhapur in 12thÂ century, the fort passed into the hands of the Yadavas of Devgiri, Bahama...", "image": "/images/PanhalaFort.jpg"}
    ]
    
    # Map city_id to city name
    city_map = {1: "nashik", 2: "pune", 3: "mumbai", 4: "nagpur", 5: "kolhapur"}
    
    for place in places_data:
        city_slug = city_map.get(place['city_id'])
        if city_slug:
            place_data = {
                "title": place['title'],
                "description": place['description'],
                "image": place['image']
            }
            cities_collection.update_one(
                {"slug": city_slug},
                {"$push": {"places": place_data}}
            )
    print(f"✅ Imported {len(places_data)} places")
    
    # ========== Import Culture ==========
    print("\n📥 Importing Culture...")
    culture_data = [
        {"city_id": 1, "title": "Misal Pav", "category": "Food", "description": "Misal pav is a dish from the Indian state of Maharashtra. It consists of a vegetable curry, mostly made from moth beans, locally known as misal, and pav, which is a type of Indian bread roll. The final dish is topped with farsan or sev, onions, lemon and...", "image": "/images/MisalPav.png"},
        {"city_id": 1, "title": "Wine Culture", "category": "Lifestyle", "description": "The district has 52 wineries in operation and consequently, Nashik is occasionally known by the epithet \"The Wine Capital of India\". The product is protected under the Geographical Indications of Goods (Registration & Protection) Act (GI Act) 1999 of the...", "image": "/images/WineCulture.jpg"},
        {"city_id": 2, "title": "Pune Culture", "category": "Heritage", "description": "The Pune Heritage Festival showcases the rich architectural and cultural heritage of the city. It involves heritage walks, exhibitions, and performances that highlight Pune's colonial past and its evolution into a modern city.", "image": "/images/PuneCulture.jpg"},
        {"city_id": 2, "title": "Street Food", "category": "Food", "description": "Sangeeta Bhel And Pani Puri is a popular street food spot in Pune, known for its vibrant and flavorful offerings. The stall offers a variety of chaat items such as Bhel Puri, Shev Puri, Dahi Puri, and the crowd-favorite Pani Puri. They serve amazing bhel.", "image": "/images/PuneStreetFood.jpg"},
        {"city_id": 3, "title": "Mumbai Street Food", "category": "Food", "description": "Vada pav, pav bhaji.,Other noted street foods in Mumbai include Dabeli, panipuri, bhelpuri, sevpuri, dahipuri, sandwiches, ragda-pattice, pav bhaji, Chinese bhel, Khaman, Dhokla, idlis, and dosas, all of which are vegetarian.", "image": "/images/MumbaiStreetFood.jpg"},
        {"city_id": 3, "title": "Bollywood", "category": "Culture", "description": "Mumbai is commonly referred to as \"Bollywood\" because it is a major hub of Bollywood TV and film production and home to many Bollywood celebrities. Most Bollywood studios are located within Film City, a 520-acre film studio complex located in Goregaon Ea...", "image": "/images/Bollywood.png"},
        {"city_id": 4, "title": "Nagpur Oranges", "category": "Food", "description": "🍊 Nagpur Oranges: 🇮🇳India's Zesty Delight Bursting with juicy sweetness and a tangy twist, #Nagpur #Maharashtra oranges are cherished across #India🇮🇳 and beyond for their bold flavour and refreshing taste", "image": "/images/NagpurOranges.jpg"},
        {"city_id": 4, "title": "Wildlife", "category": "Nature", "description": "Nagpur is blessed to be quite close to some incredible wildlife sanctuaries in India. The most popular ones are Bor wildlife sanctuary, Melghat tiger reserve, Navegaon Nagzira tiger reserve, Pench tiger reserve and many more. Where is Bor wildlife sanctu...", "image": "/images/nagpurWildlife.jpg"},
        {"city_id": 5, "title": "Kolhapuri Food", "category": "Food", "description": "Mutton dishes : Kolhapur is known for non-vegetarian meal. Tambada rassa and Pandhara rassa, dry and fried mutton, and mutton pickle . Even though eaten in the restaurant it's Maratha household flavor can be experienced. Kheema Balls Rice is also well kn...", "image": "/images/KolhapuriFood.jpg"},
        {"city_id": 5, "title": "Royal Culture", "category": "Heritage", "description": "Kolhapur's cultural identity is further enriched by its tradition of craftsmanship, notably the famed Kolhapuri Saaj. These distinctive necklaces, crafted with detailed gold work and ornamented with gems such as rubies, emeralds, and pearls, are masterpi...", "image": "/images/kolhapurCulture.jpg"}
    ]
    
    for culture in culture_data:
        city_slug = city_map.get(culture['city_id'])
        if city_slug:
            culture_item = {
                "title": culture['title'],
                "category": culture['category'],
                "description": culture['description'],
                "image": culture['image']
            }
            cities_collection.update_one(
                {"slug": city_slug},
                {"$push": {"culture": culture_item}}
            )
    print(f"✅ Imported {len(culture_data)} culture items")
    
    # ========== Import Stays ==========
    print("\n📥 Importing Stays...")
    stays_data = [
        {"city_id": 1, "name": "Sula Resort", "type": "Luxury", "description": "Stay in vineyard.,Indulge in unforgettable stays at 3 or 4-bedroom villas, each boasting a private pool for an intimate and opulent retreat. Unwind by spell-binding infinity pools, sipping exquisite wine while immersed in breathtaking views of nature.", "image": "/images/SulaResort.jpg", "price": 12000.00, "amenities": "Wine, Pool, Spa", "booking_link": "link"},
        {"city_id": 2, "name": "JW Marriott Pune", "type": "Luxury", "description": "Premium hotel.Offering 5-star rooms overlooking the city, JW Marriott Pune features a spa, a temperature controlled pool with a bar and a rooftop restaurant. Providing free parking, it has 8 dining options.", "image": "/images/", "price": 10000.00, "amenities": "Gym, Dining", "booking_link": "link"},
        {"city_id": 3, "name": "Taj Hotel Mumbai", "type": "Luxury", "description": "Sea-facing hotel.The Taj Mahal Palace is a heritage, five-star, luxury hotel in the Colaba area of Mumbai, Maharashtra, India, situated next to the Gateway of India. Built in the Indo-Saracenic style, it opened in 1903 as the Taj Mahal Hotel, and has his...", "image": "/images/", "price": 15000.00, "amenities": "Sea View, Dining", "booking_link": "link"},
        {"city_id": 4, "name": "Le Meridien Nagpur", "type": "Hotel", "description": "Comfort stay.Le Meridien Nagpur is a stylish hotel located just a 10-minute drive from Dr. Babasaheb Ambedkar International Airport. The hotel offers modern rooms with free Wi-Fi, making it ideal for both business and leisure travelers.", "image": "/images/", "price": 7000.00, "amenities": "Rooms, Parking", "booking_link": "link"},
        {"city_id": 5, "name": "Sayaji Hotel Kolhapur", "type": "Hotel", "description": "Modern stay.Welcome to Sayaji Kolhapur, a prestigious hotel offering renowned hospitality in the heart of Kolhapur. Our Grand Rooms are designed to provide the utmost in comfort and elegance, making them the perfect retreat for both business and leisure ...", "image": "/images/", "price": 6000.00, "amenities": "Dining, Rooms", "booking_link": "link"}
    ]
    
    for stay in stays_data:
        city_slug = city_map.get(stay['city_id'])
        if city_slug:
            stay_item = {
                "name": stay['name'],
                "type": stay['type'],
                "description": stay['description'],
                "image": stay['image'],
                "price": stay['price'],
                "amenities": stay['amenities'],
                "booking_link": stay['booking_link']
            }
            cities_collection.update_one(
                {"slug": city_slug},
                {"$push": {"stays": stay_item}}
            )
    print(f"✅ Imported {len(stays_data)} stays")
    
    # ========== Import Transport ==========
    print("\n📥 Importing Transport...")
    transport_data = [
        {"city_id": 1, "type": "road", "title": "Road Journey", "description": "Good road connectivity"},
        {"city_id": 1, "type": "rail", "title": "Rail Access", "description": "Well connected by train"},
        {"city_id": 2, "type": "road", "title": "Road Journey", "description": "Easy access from Mumbai"},
        {"city_id": 2, "type": "rail", "title": "Rail Access", "description": "Major railway junction"},
        {"city_id": 3, "type": "road", "title": "Road Journey", "description": "Excellent highways"},
        {"city_id": 3, "type": "air", "title": "Airport", "description": "International airport"},
        {"city_id": 4, "type": "rail", "title": "Rail Access", "description": "Central railway hub"},
        {"city_id": 4, "type": "road", "title": "Road Journey", "description": "Good connectivity"},
        {"city_id": 5, "type": "road", "title": "Road Journey", "description": "Accessible by highways"},
        {"city_id": 5, "type": "rail", "title": "Rail Access", "description": "Train connectivity"}
    ]
    
    for transport in transport_data:
        city_slug = city_map.get(transport['city_id'])
        if city_slug:
            transport_item = {
                "type": transport['type'],
                "title": transport['title'],
                "description": transport['description']
            }
            cities_collection.update_one(
                {"slug": city_slug},
                {"$push": {"transport": transport_item}}
            )
    print(f"✅ Imported {len(transport_data)} transport items")
    
    # ========== Import Products ==========
    print("\n📥 Importing Products...")
    products_data = [
        {"name": "Warli Painting", "description": "Traditional tribal art from Maharashtra", "price": 1499, "image": "/images/warli.jpg", "category": "Painting", "stock": 10},
        {"name": "Kolhapuri Chappal", "description": "Authentic handcrafted leather footwear", "price": 1899, "image": "/images/Kolhapuri.jpg", "category": "Footwear", "stock": 15},
        {"name": "Paithani Saree", "description": "Beautiful traditional silk saree", "price": 12999, "image": "/images/saree.jpg", "category": "Clothing", "stock": 5},
        {"name": "Sawantwadi Toy", "description": "Wooden handmade toy from Sawantwadi", "price": 2299, "image": "/images/toy.jpg", "category": "Craft", "stock": 8},
        {"name": "Soil Artifact", "description": "This image shows traditional handcrafted clay idols inspired by the goddess Durga. The statues are designed with multiple arms and detailed facial expressions, representing strength, protection, and divine power", "price": 1200, "image": "/images/SoilToy.webp", "category": "Craft", "stock": 10},
        {"name": "Bidriware Silver Inlay Jug", "description": "The GiTAGGED Bidriware Silver Inlay Persian Jug showcases exquisite Indian craftsmanship from Bidar, blending traditional metal inlay artistry with elegant design.", "price": 3200, "image": "/images/BidriwareJug.jpg", "category": "Craft", "stock": 7},
        {"name": "Brass Multi Wick Lamp", "description": "The Brass Multi Wick Lamp is a beautifully handcrafted traditional lamp made from pure brass and designed with multiple wick holders. It is commonly used during pooja, aarti, and festivals such as Diwali and Navratri.", "price": 1200, "image": "/images/BrassLamp.png", "category": "Craft", "stock": 67},
        {"name": "Bamboo Lamp", "description": "The Bamboo Lamp is a handcrafted decorative light made from natural bamboo. It is eco-friendly, lightweight, and designed with intricate woven patterns that create a warm and soothing glow. Commonly used for home décor, cafés, and gifting, this lamp ad...", "price": 450, "image": "/images/BambooLamp.png", "category": "Craft", "stock": 89}
    ]
    
    for product in products_data:
        product['created_at'] = datetime.utcnow()
        product['updated_at'] = datetime.utcnow()
        products_collection.update_one(
            {"name": product['name']},
            {"$set": product},
            upsert=True
        )
    print(f"✅ Imported {len(products_data)} products")
    
    # ========== Import Questions ==========
    print("\n📥 Importing Questions...")
    questions_data = [
        {"question": "Which fort was the capital of Chhatrapati Shivaji Maharaj?", "option_a": "Raigad", "option_b": "Sinhagad", "option_c": "Pratapgad", "option_d": "Panhala", "correct_answer": 1, "category": "History"},
        {"question": "Who founded the Maratha Empire?", "option_a": "Shivaji Maharaj", "option_b": "Sambhaji Maharaj", "option_c": "Bajirao", "option_d": "Shahu Maharaj", "correct_answer": 1, "category": "History"},
        {"question": "Which city is famous for the Ajanta Caves?", "option_a": "Aurangabad", "option_b": "Nashik", "option_c": "Kolhapur", "option_d": "Pune", "correct_answer": 1, "category": "History"},
        {"question": "Which dance form is closely associated with Maharashtra?", "option_a": "Lavani", "option_b": "Kathak", "option_c": "Garba", "option_d": "Bihu", "correct_answer": 1, "category": "Culture"},
        {"question": "Warli painting belongs to which state?", "option_a": "Maharashtra", "option_b": "Gujarat", "option_c": "Rajasthan", "option_d": "Madhya Pradesh", "correct_answer": 1, "category": "Culture"},
        {"question": "Which traditional attire is popular in Maharashtrian culture?", "option_a": "Nauvari Saree", "option_b": "Mekhela Chador", "option_c": "Phiran", "option_d": "Ghagra", "correct_answer": 1, "category": "Culture"},
        {"question": "Which dish is a famous Maharashtrian breakfast?", "option_a": "Misal Pav", "option_b": "Dhokla", "option_c": "Idli", "option_d": "Poha Jalebi", "correct_answer": 1, "category": "Cuisine"},
        {"question": "Which sweet dish is popular in Maharashtra?", "option_a": "Puran Poli", "option_b": "Rasgulla", "option_c": "Mysore Pak", "option_d": "Ghewar", "correct_answer": 1, "category": "Cuisine"},
        {"question": "Which snack is strongly associated with Mumbai?", "option_a": "Vada Pav", "option_b": "Kachori", "option_c": "Samosa", "option_d": "Dabeli", "correct_answer": 1, "category": "Cuisine"}
    ]
    
    for question in questions_data:
        question['created_at'] = datetime.utcnow()
        question['updated_at'] = datetime.utcnow()
        questions_collection.update_one(
            {"question": question['question']},
            {"$set": question},
            upsert=True
        )
    print(f"✅ Imported {len(questions_data)} questions")
    
    # ========== Create Indexes ==========
    print("\n📊 Creating Indexes...")
    cities_collection.create_index("slug", unique=True)
    cities_collection.create_index("name")
    products_collection.create_index("name")
    products_collection.create_index("category")
    questions_collection.create_index("category")
    print("✅ Indexes created")
    
    # ========== Summary ==========
    print("\n" + "=" * 70)
    print("✅ IMPORT COMPLETE!")
    print("=" * 70)
    print("\n📊 Summary:")
    print(f"   Cities: {cities_collection.count_documents({})}")
    print(f"   Products: {products_collection.count_documents({})}")
    print(f"   Questions: {questions_collection.count_documents({})}")
    
    # Show sample city with embedded data
    sample_city = cities_collection.find_one({"slug": "nashik"})
    if sample_city:
        print(f"\n🏙️  Sample City: Nashik")
        print(f"   Places: {len(sample_city.get('places', []))}")
        print(f"   Culture: {len(sample_city.get('culture', []))}")
        print(f"   Stays: {len(sample_city.get('stays', []))}")
        print(f"   Transport: {len(sample_city.get('transport', []))}")
    
    print("\n🚀 Your MongoDB is ready!")
    print("Start the server: uvicorn app.main:app --reload")

if __name__ == "__main__":
    import_all_data()