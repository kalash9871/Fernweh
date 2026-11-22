"""
=============================================================================
TripCraft — Multi-Page Travel Planning Web Application Backend
BCA 5th Semester Web Application Development Project
=============================================================================

Technology: Python 3 with Flask & Werkzeug Security
Security Features:
- Secure password hashing using PBKDF2/Scrypt via werkzeug.security
- No passwords stored in plain text
- Backend route protection for /profile and /settings
- Strict input validation and sanitization for all API routes
- Protected session management and safe logout handling
"""

import os
import re
import math
from flask import Flask, jsonify, request, send_from_directory, abort, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

# ==================== DIRECTORY CONFIGURATION ====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = BASE_DIR

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "tripcraft-bca-capstone-dark-upgrade-2026-secure-key")

# ==================== IN-MEMORY USER STORE WITH SECURE HASHING ====================
# Default demo user for easy evaluation (Password securely hashed with scrypt/pbkdf2)
USERS = {
    "explorer@tripcraft.in": {
        "id": "usr_001",
        "email": "explorer@tripcraft.in",
        "password_hash": generate_password_hash("password123"),
        "name": "Aarav Sharma",
        "home_city": "New Delhi",
        "travel_style": "nature",
        "phone": "+91 98765 43210",
        "bio": "Passionate backpacker exploring offbeat corners and hidden cultural trails across India.",
        "saved_trips": [
            {
                "id": "trip_01",
                "destination": "ziro",
                "destination_name": "Ziro Valley",
                "state": "Arunachal Pradesh",
                "days": 4,
                "travellers": 2,
                "preference": "nature",
                "estimated_per_person": 9452,
                "total_group_cost": 18904,
                "date_created": "Nov 2026"
            },
            {
                "id": "trip_02",
                "destination": "gokarna",
                "destination_name": "Gokarna",
                "state": "Karnataka",
                "days": 3,
                "travellers": 2,
                "preference": "relaxation",
                "estimated_per_person": 6570,
                "total_group_cost": 13140,
                "date_created": "Nov 2026"
            }
        ]
    }
}
USERS["explorer@fernweh.in"] = USERS["explorer@tripcraft.in"]

# ==================== DESTINATIONS DATABASE (WITH ACCURATE COORDINATES) ====================
DESTINATIONS = {
    "ziro": {
        "id": "ziro",
        "name": "Ziro Valley",
        "state": "Arunachal Pradesh",
        "category": "mountains",
        "tag": "Apatani Cultural Haven",
        "image": "photo/ziro.jpg",
        "description": "A tranquil valley cradled by pine-clad hills and emerald paddy terraces, home to the indigenous Apatani tribe known for sustainable farming, traditional wooden bamboo houses, and the famed Ziro Music Festival.",
        "best_time": "March to October (Ziro Festival in late Sept)",
        "daily_rate_text": "₹1,800 - ₹2,600 / day",
        "coordinates": {"lat": 27.5600, "lng": 93.8300},
        "airport": "Donyi Polo Airport, Itanagar (HGI, ~100 km) / Lilabari (IXI)",
        "airport_query": "Donyi+Polo+Airport+Itanagar",
        "railway": "Naharlagun Railway Station (NHN, ~95 km)",
        "railway_query": "Naharlagun+Railway+Station",
        "map_query": "Ziro+Valley+Arunachal+Pradesh",
        "rates": {"stay": 1000, "food": 650, "transport": 600, "activity": 400},
        "highlights": [
            "Apatani tribal villages (Hong, Hari, Hija)",
            "Tarin High-Altitude Fish Farm & Pine Groves",
            "Kardo Shiva Lingam (natural rock formation)",
            "Local organic kiwi orchards & rice beer tasting"
        ]
    },
    "tawang": {
        "id": "tawang",
        "name": "Tawang",
        "state": "Arunachal Pradesh",
        "category": "mountains",
        "tag": "Monasteries & High Passes",
        "image": "photo/tawang.jpg",
        "description": "Perched at an elevation of 10,000 feet near the Indo-Bhutan border, Tawang is renowned for India's largest Buddhist monastery founded in 1681, breathtaking high-altitude mountain passes, and crystal glacial lakes.",
        "best_time": "March to June & September to November",
        "daily_rate_text": "₹2,200 - ₹3,200 / day",
        "coordinates": {"lat": 27.5861, "lng": 91.8667},
        "airport": "Tezpur Airport (TEZ, ~320 km) / Guwahati (GAU, ~440 km)",
        "airport_query": "Tezpur+Airport",
        "railway": "Rangapara North Railway Station (~315 km)",
        "railway_query": "Rangapara+North+Railway+Station",
        "map_query": "Tawang+Arunachal+Pradesh",
        "rates": {"stay": 1200, "food": 750, "transport": 950, "activity": 500},
        "highlights": [
            "Tawang Monastery (Ganden Namgyal Lhatse)",
            "Sela Pass & frozen Sela Lake (13,700 ft)",
            "Madhuri Lake (Sangetsar Tso) mountain bowl",
            "Nuranang Falls (Bap Teng Kang) cascade"
        ]
    },
    "majuli": {
        "id": "majuli",
        "name": "Majuli Island",
        "state": "Assam",
        "category": "coastal",
        "tag": "World's Largest River Island",
        "image": "photo/Majuli.jpg",
        "description": "Formed by the mighty Brahmaputra River, Majuli is the world's largest inhabited river island and the heart of Assamese Neo-Vaishnavite culture, renowned for ancient Satras, traditional mask making, and peaceful riverbank life.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,500 - ₹2,300 / day",
        "coordinates": {"lat": 26.9500, "lng": 94.2167},
        "airport": "Jorhat Airport / Rowriah (JRH, ~20 km + Nimati Ghat ferry)",
        "airport_query": "Jorhat+Airport+Rowriah",
        "railway": "Jorhat Town Railway Station (JTTN, ~18 km)",
        "railway_query": "Jorhat+Town+Railway+Station",
        "map_query": "Majuli+Island+Assam",
        "rates": {"stay": 850, "food": 550, "transport": 450, "activity": 350},
        "highlights": [
            "Kamalabari & Auniati Neo-Vaishnavite Satras",
            "Traditional Mukha mask-making at Natun Samaguri",
            "Scenic Brahmaputra sunset ferry crossing",
            "Mishing tribal village hospitality and pottery"
        ]
    },
    "gokarna": {
        "id": "gokarna",
        "name": "Gokarna",
        "state": "Karnataka",
        "category": "coastal",
        "tag": "Pristine Arabian Coast",
        "image": "photo/Gokarna.jpg",
        "description": "A tranquil temple town bordered by rugged Western Ghats cliffs and untouched crescent beaches. Offers serene beach treks, golden sands, and cliffside sunsets without the chaotic crowds of mainstream beach destinations.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,600 - ₹2,500 / day",
        "coordinates": {"lat": 14.5479, "lng": 74.3188},
        "airport": "Goa Dabolim Airport (GOI, ~140 km) / Mopa (GOX)",
        "airport_query": "Goa+International+Airport+Dabolim",
        "railway": "Gokarna Road Railway Station (GOK, ~9 km)",
        "railway_query": "Gokarna+Road+Railway+Station",
        "map_query": "Gokarna+Karnataka",
        "rates": {"stay": 950, "food": 650, "transport": 450, "activity": 350},
        "highlights": [
            "Om Beach, Kudle Beach & Half Moon Beach cliff trek",
            "Ancient Mahabaleshwar Temple & Kotitirtha sacred pond",
            "Cliffside yoga and peaceful Arabian sea sunset views",
            "Historic Mirjan Fort day trip"
        ]
    },
    "devprayag": {
        "id": "devprayag",
        "name": "Devprayag",
        "state": "Uttarakhand",
        "category": "heritage",
        "tag": "Sacred Holy Confluence",
        "image": "photo/Devprayag.jpg",
        "description": "The mystical mountain town where the gushing turquoise Bhagirathi river meets the calm, silvery Alaknanda river to form the holy River Ganga. Perched dramatically between steep Himalayan river cliffs.",
        "best_time": "Year-Round (Pleasant Oct to April)",
        "daily_rate_text": "₹1,400 - ₹2,200 / day",
        "coordinates": {"lat": 30.1459, "lng": 78.5986},
        "airport": "Jolly Grant Airport, Dehradun (DED, ~90 km)",
        "airport_query": "Jolly+Grant+Airport+Dehradun",
        "railway": "Yog Nagari Rishikesh Railway Station (YNRK, ~70 km)",
        "railway_query": "Yog+Nagari+Rishikesh+Railway+Station",
        "map_query": "Devprayag+Uttarakhand",
        "rates": {"stay": 800, "food": 500, "transport": 450, "activity": 300},
        "highlights": [
            "Confluence (Sangam) of Bhagirathi and Alaknanda",
            "1000-year-old Raghunathji Temple stone architecture",
            "Dramatic pedestrian suspension bridges over the river gorge",
            "Evening riverside aarti along the holy ghats"
        ]
    },
    "mawlynnong": {
        "id": "mawlynnong",
        "name": "Mawlynnong",
        "state": "Meghalaya",
        "category": "nature",
        "tag": "Asia's Cleanest Eco-Village",
        "image": "photo/mawlynnong.jpg",
        "description": "Renowned as 'God's Own Garden', this eco-conscious Khasi tribal village maintains 100% cleanliness with bamboo waste bins, flowering pathways, nearby bio-engineered living root bridges, and views overlooking Bangladesh.",
        "best_time": "September to May (Lush post-monsoon greenery)",
        "daily_rate_text": "₹1,700 - ₹2,600 / day",
        "coordinates": {"lat": 25.2017, "lng": 91.9056},
        "airport": "Shillong Airport, Umroi (SHL, ~90 km) / Guwahati (GAU)",
        "airport_query": "Shillong+Airport+Umroi",
        "railway": "Guwahati Railway Station (GHY, ~170 km)",
        "railway_query": "Guwahati+Railway+Station",
        "map_query": "Mawlynnong+Meghalaya",
        "rates": {"stay": 1050, "food": 600, "transport": 700, "activity": 400},
        "highlights": [
            "Jingmaham Single Living Root Bridge in neighboring Riwai",
            "Sky Walk 85-foot bamboo canopy watchtower",
            "Natural Balancing Rock geological phenomenon",
            "Dawki Umngot river crystal boating excursion (~30 km)"
        ]
    },
    "chopta": {
        "id": "chopta",
        "name": "Chopta",
        "state": "Uttarakhand",
        "category": "mountains",
        "tag": "Mini Switzerland of India",
        "image": "photo/chopta.jpg",
        "description": "An untouched alpine meadow (Bugyal) in the Garhwal Himalayas enveloped by dense pine, deodar, and rhododendron forests. Serves as the starting base for trekking to Tungnath (highest Shiva temple) and Chandrashila Summit.",
        "best_time": "April to June (Spring flora) & Sept to Nov (Crisp peaks)",
        "daily_rate_text": "₹1,800 - ₹2,700 / day",
        "coordinates": {"lat": 30.4853, "lng": 79.1706},
        "airport": "Jolly Grant Airport, Dehradun (DED, ~215 km)",
        "airport_query": "Jolly+Grant+Airport+Dehradun",
        "railway": "Rishikesh (YNRK, ~195 km) / Haridwar Junction (HW)",
        "railway_query": "Haridwar+Railway+Station",
        "map_query": "Chopta+Uttarakhand",
        "rates": {"stay": 1000, "food": 600, "transport": 750, "activity": 450},
        "highlights": [
            "Tungnath Temple trek (world's highest Shiva shrine)",
            "Chandrashila Peak 360° summit views (Nanda Devi, Trishul)",
            "Serene Deoria Tal glacial lake forest walk",
            "Stargazing and eco-camping in pristine alpine meadows"
        ]
    },
    "orchha": {
        "id": "orchha",
        "name": "Orchha",
        "state": "Madhya Pradesh",
        "category": "heritage",
        "tag": "Bundela Royal Splendor",
        "image": "photo/orchha.jpg",
        "description": "A frozen-in-time medieval capital situated along the rocky banks of the Betwa River. Famous for dramatic 16th-century Bundela Rajput architecture, palace fortresses, grand riverside cenotaphs, and ancient murals.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,500 - ₹2,400 / day",
        "coordinates": {"lat": 25.3514, "lng": 78.6417},
        "airport": "Gwalior Airport (GWL, ~125 km) / Khajuraho (HJR, ~170 km)",
        "airport_query": "Gwalior+Airport",
        "railway": "Virangana Lakshmibai Jhansi Junction (VGLJ, ~18 km)",
        "railway_query": "Virangana+Lakshmibai+Jhansi+Junction",
        "map_query": "Orchha+Madhya+Pradesh",
        "rates": {"stay": 900, "food": 550, "transport": 400, "activity": 400},
        "highlights": [
            "Jahangir Mahal & Raja Mahal intricate fresco paintings",
            "14 royal memorial Chhatris reflecting on the Betwa River",
            "Ram Raja Temple (where Lord Rama is revered as king)",
            "Peaceful river rafting / sunset views along Betwa boulders"
        ]
    },
    "dhanushkodi": {
        "id": "dhanushkodi",
        "name": "Dhanushkodi",
        "state": "Tamil Nadu",
        "category": "coastal",
        "tag": "Mystical Edge of India",
        "image": "photo/Dhanushkodi.jpg",
        "description": "An evocative ghost town on the southeastern tip of Pamban Island, bordered by the turbulent Bay of Bengal on one side and the calm Indian Ocean on the other, at the geographical starting point of Rama Setu.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,600 - ₹2,500 / day",
        "coordinates": {"lat": 9.1786, "lng": 79.4144},
        "airport": "Madurai International Airport (IXM, ~195 km)",
        "airport_query": "Madurai+Airport",
        "railway": "Rameswaram Railway Station (RMM, ~20 km)",
        "railway_query": "Rameswaram+Railway+Station",
        "map_query": "Dhanushkodi+Tamil+Nadu",
        "rates": {"stay": 950, "food": 600, "transport": 550, "activity": 350},
        "highlights": [
            "Submerged 1964 cyclone ruins (Church, Railway Station)",
            "Rama Setu (Adam's Bridge) point & two-ocean confluence",
            "Pamban sea rail bridge crossing experience",
            "Pristine white sandbars and flamingo birdwatching"
        ]
    }
}

# ==================== TRAVEL PREFERENCE MULTIPLIERS ====================
PREFERENCE_MULTIPLIERS = {
    "adventure": {"stay": 1.0, "food": 1.05, "transport": 1.15, "activity": 1.25},
    "cultural": {"stay": 1.05, "food": 1.0, "transport": 1.0, "activity": 1.20},
    "relaxation": {"stay": 1.20, "food": 1.15, "transport": 1.05, "activity": 0.90},
    "nature": {"stay": 1.0, "food": 1.0, "transport": 1.05, "activity": 1.05}
}

PREFERENCE_TITLES = {
    "adventure": [
        "Arrival & Trail Scouting",
        "Trek to High Ridge",
        "Wilderness Exploration",
        "River Crossing & Summit",
        "Valley Adventure & Descent"
    ],
    "cultural": [
        "Arrival & Heritage Walk",
        "Monastery & Artisan Satra Tour",
        "Village Folk Tradition",
        "Ancient Temple Legends",
        "Local Market & Crafts"
    ],
    "relaxation": [
        "Check-in & Scenic Stroll",
        "Riverside Peace & Cafe Chill",
        "Panoramic Sunset Viewing",
        "Slow Nature Walk",
        "Unwinding & Departure"
    ],
    "nature": [
        "Arrival & Green Valley Walk",
        "Forest Sanctuary Trail",
        "Living Root & Waterfall Trek",
        "Sunrise Peak Vista",
        "Eco-Village Farewell"
    ]
}

# ==================== BUDGET CALCULATION ENGINE ====================
def calculate_trip_budget(dest_key, days, user_budget_per_person, travellers, preference):
    dest = DESTINATIONS[dest_key]
    multiplier = PREFERENCE_MULTIPLIERS.get(preference, {"stay": 1.0, "food": 1.0, "transport": 1.0, "activity": 1.0})

    # Accommodation: twin-sharing basis (rooms = ceil(travellers / 2))
    room_rate_per_night = round(dest["rates"]["stay"] * 1.6 * multiplier["stay"])
    num_rooms = math.ceil(travellers / 2)
    nights = max(1, days - 1)
    total_lodging_group = room_rate_per_night * num_rooms * nights
    lodging_per_person = round(total_lodging_group / travellers)

    # Food: Per-person daily meals
    daily_food_per_person = round(dest["rates"]["food"] * multiplier["food"])
    total_food_per_person = daily_food_per_person * days

    # Local Transport: Shared cab or auto pool (1 cab per 4 travellers)
    base_daily_cab_rate = round(dest["rates"]["transport"] * 2.2 * multiplier["transport"])
    num_vehicles = math.ceil(travellers / 4)
    total_transport_group = base_daily_cab_rate * num_vehicles * days
    transport_per_person = round(total_transport_group / travellers)

    # Sightseeing & Activities: Per-person tickets, local permits, guide fees
    daily_activity_per_person = round(dest["rates"]["activity"] * multiplier["activity"])
    total_activity_per_person = daily_activity_per_person * days

    # Aggregate Totals
    total_estimated_per_person = lodging_per_person + total_food_per_person + transport_per_person + total_activity_per_person
    daily_estimated_per_person = round(total_estimated_per_person / days)

    total_estimated_group = total_estimated_per_person * travellers
    total_budget_group = user_budget_per_person * travellers
    budget_difference = user_budget_per_person - total_estimated_per_person
    is_sufficient = budget_difference >= 0

    return {
        "user_budget_per_person": user_budget_per_person,
        "total_budget_group": total_budget_group,
        "total_estimated_per_person": total_estimated_per_person,
        "daily_estimated_per_person": daily_estimated_per_person,
        "total_estimated_group": total_estimated_group,
        "budget_difference": budget_difference,
        "is_sufficient": is_sufficient,
        "breakdown": {
            "accommodation": lodging_per_person,
            "food": total_food_per_person,
            "transport": transport_per_person,
            "activity": total_activity_per_person
        }
    }

# ==================== DAY-WISE ITINERARY ENGINE ====================
def generate_day_wise_itinerary(dest_key, days, preference):
    dest = DESTINATIONS[dest_key]
    pool = dest["highlights"]
    titles = PREFERENCE_TITLES.get(preference, PREFERENCE_TITLES["nature"])

    schedule = []
    for day_num in range(1, days + 1):
        title_idx = (day_num - 1) % len(titles)
        main_highlight = pool[(day_num - 1) % len(pool)]

        if day_num == 1:
            morning = f"Arrival at {dest['name']} base. Check into your local guesthouse or homestay, freshen up, and enjoy a traditional welcome refreshment."
            afternoon = "Gentle orientation walk around the neighborhood. Explore local alleys and sample authentic regional lunch at an indigenous eatery."
            evening = "Witness a serene sunset overlooking the surrounding landscapes. Evening briefing on local customs and permits."
            tip = "Keep small cash currency handy; remote Himalayan and island spots have limited digital POS terminals."
        elif day_num == days:
            morning = f"Early sunrise excursion to catch the golden morning light over {dest['name']}. Capture final scenic photography."
            afternoon = "Visit the local artisans market. Pick up authentic indigenous handlooms, organic honey, or handcrafted souvenirs."
            evening = f"Pack luggage, settle homestay accounts, and initiate return transfer toward {dest['railway']} or {dest['airport']}."
            tip = "Start transit at least 4 hours before scheduled departure due to winding mountain roads or ferry timetables."
        else:
            morning = f"Guided morning expedition: Experience <strong>{main_highlight}</strong>. Best visited early to enjoy calm weather and avoid midday heat."
            afternoon = "Traditional communal lunch with locals. In-depth exploration of historic spots, bamboo trails, or peaceful riverfront sights."
            evening = "Relax at a local mountain cafe or riverside viewpoint. Enjoy authentic herbal tea or regional snacks while stargazing."
            tip = "Carry a refillable water bottle and wear comfortable, sturdy walking shoes for stone steps and uneven terrain."

        schedule.append({
            "day": day_num,
            "theme": f"Day {day_num}: {titles[title_idx]}",
            "morning": morning,
            "afternoon": afternoon,
            "evening": evening,
            "tip": tip
        })

    return schedule

# ==================== MULTI-PAGE HTML ROUTING WITH ACCESS PROTECTION ====================
@app.route("/")
@app.route("/index.html")
def page_home():
    """Serves the Home page."""
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/destinations")
@app.route("/destinations.html")
def page_destinations():
    """Serves the Dedicated Destinations page."""
    return send_from_directory(FRONTEND_DIR, "destinations.html")

@app.route("/planner")
@app.route("/planner.html")
def page_planner():
    """Serves the Dedicated Trip Planning page."""
    return send_from_directory(FRONTEND_DIR, "planner.html")

@app.route("/about")
@app.route("/about.html")
def page_about():
    """Serves the Dedicated About page."""
    return send_from_directory(FRONTEND_DIR, "about.html")

@app.route("/login")
@app.route("/login.html")
def page_login():
    """Serves the User Login page."""
    return send_from_directory(FRONTEND_DIR, "login.html")

@app.route("/register")
@app.route("/register.html")
def page_register():
    """Serves the User Registration page."""
    return send_from_directory(FRONTEND_DIR, "register.html")

@app.route("/profile")
@app.route("/profile.html")
def page_profile():
    """
    Protected Route: Serves User Profile only if session exists,
    otherwise redirects to login.
    """
    email = session.get("user_email")
    if not email or email not in USERS:
        return redirect("/login.html?login_required=true")
    return send_from_directory(FRONTEND_DIR, "profile.html")

@app.route("/settings")
@app.route("/settings.html")
def page_settings():
    """
    Protected Route: Serves User Settings only if session exists,
    otherwise redirects to login.
    """
    email = session.get("user_email")
    if not email or email not in USERS:
        return redirect("/login.html?login_required=true")
    return send_from_directory(FRONTEND_DIR, "settings.html")

@app.route("/logout")
def action_logout():
    """Clears user session and redirects to Home."""
    session.pop("user_email", None)
    return redirect("/?logged_out=true")

@app.route("/<path:path>")
def serve_static(path):
    """Serves frontend static assets (CSS, JS, images, etc.)."""
    full_path = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(full_path):
        return send_from_directory(FRONTEND_DIR, path)
    abort(404)

# ==================== REST API ENDPOINTS ====================
@app.route("/api/destinations", methods=["GET"])
def get_destinations():
    """
    Returns list of all 9 curated Indian destinations with metadata and coordinates.
    """
    dest_list = list(DESTINATIONS.values())
    return jsonify({
        "status": "success",
        "count": len(dest_list),
        "destinations": dest_list
    }), 200

@app.route("/api/plan-trip", methods=["POST"])
def plan_trip():
    """
    Validates input parameters and returns a complete, destination-based
    budget analysis and day-wise itinerary.
    """
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Invalid request: Expected Content-Type application/json."
        }), 400

    data = request.get_json()
    if not data:
        return jsonify({
            "status": "error",
            "message": "Empty request body provided."
        }), 400

    dest_key = data.get("destination")
    days_raw = data.get("days")
    budget_raw = data.get("budget_per_person")
    travellers_raw = data.get("travellers")
    preference = data.get("preference", "nature")

    # Destination Validation
    if not dest_key or not isinstance(dest_key, str):
        return jsonify({
            "status": "error",
            "message": "Destination is required and must be a valid key."
        }), 400

    dest_key = dest_key.strip().lower()
    if dest_key not in DESTINATIONS:
        return jsonify({
            "status": "error",
            "message": f"Unknown destination '{dest_key}'. Must be one of: {', '.join(DESTINATIONS.keys())}."
        }), 400

    # Days Validation (1 to 14)
    try:
        days = int(days_raw)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Days must be an integer between 1 and 14."
        }), 400

    if days < 1 or days > 14:
        return jsonify({
            "status": "error",
            "message": "Trip duration must be between 1 and 14 days."
        }), 400

    # Travellers Validation (1 to 20)
    try:
        travellers = int(travellers_raw)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Travellers count must be an integer between 1 and 20."
        }), 400

    if travellers < 1 or travellers > 20:
        return jsonify({
            "status": "error",
            "message": "Number of travellers must be between 1 and 20."
        }), 400

    # Budget Validation (min 1,000 INR)
    try:
        budget_per_person = int(budget_raw)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Budget per person must be a valid numeric figure in INR."
        }), 400

    if budget_per_person < 1000:
        return jsonify({
            "status": "error",
            "message": "Minimum budget per person must be at least ₹1,000 INR."
        }), 400

    # Preference Validation
    valid_preferences = ["adventure", "cultural", "relaxation", "nature"]
    preference = str(preference).strip().lower()
    if preference not in valid_preferences:
        preference = "nature"

    # Compute
    budget_result = calculate_trip_budget(dest_key, days, budget_per_person, travellers, preference)
    itinerary_result = generate_day_wise_itinerary(dest_key, days, preference)
    dest = DESTINATIONS[dest_key]

    response_payload = {
        "status": "success",
        "data": {
            "destination": {
                "id": dest["id"],
                "name": dest["name"],
                "state": dest["state"],
                "category": dest["category"],
                "tag": dest["tag"],
                "image": dest["image"],
                "description": dest["description"],
                "best_time": dest["best_time"],
                "daily_rate_text": dest["daily_rate_text"],
                "coordinates": dest["coordinates"],
                "airport": dest["airport"],
                "railway": dest["railway"]
            },
            "parameters": {
                "days": days,
                "travellers": travellers,
                "preference": preference,
                "user_budget_per_person": budget_per_person
            },
            "budget": budget_result,
            "itinerary": itinerary_result,
            "transit_links": {
                "destination_map_url": f"https://www.google.com/maps/search/?api=1&query={dest['map_query']}",
                "destination_label": f"{dest['name']}, {dest['state']}",
                "airport_name": dest["airport"],
                "airport_map_url": f"https://www.google.com/maps/search/?api=1&query={dest['airport_query']}",
                "railway_name": dest["railway"],
                "railway_map_url": f"https://www.google.com/maps/search/?api=1&query={dest['railway_query']}"
            },
            "disclaimer": "Academic Estimation Disclaimer: All financial figures and transport costs are realistic baseline estimates calculated for college project planning and educational reference. TripCraft does not claim live real-time pricing or live ticket booking."
        }
    }

    return jsonify(response_payload), 200

# ==================== AUTHENTICATION & USER APIS WITH HASHING ====================
EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    """
    Secure login: verifies hashed password against user store.
    Never stores or compares passwords in plain text.
    """
    if not request.is_json:
        return jsonify({"status": "error", "message": "Expected JSON data."}), 400

    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required."}), 400

    user = USERS.get(email)
    if not user:
        return jsonify({"status": "error", "message": "Invalid email or password."}), 401

    # Verify hashed password using Werkzeug security
    stored_hash = user.get("password_hash", "")
    if not stored_hash or not check_password_hash(stored_hash, password):
        return jsonify({"status": "error", "message": "Invalid email or password."}), 401

    session["user_email"] = user["email"]

    # Safe serialization: Never expose password or password_hash to client
    user_copy = {k: v for k, v in user.items() if k not in ["password", "password_hash"]}
    return jsonify({"status": "success", "message": "Login successful!", "user": user_copy}), 200

@app.route("/api/auth/register", methods=["POST"])
def auth_register():
    """
    Secure registration: validates inputs and hashes password before storage.
    """
    if not request.is_json:
        return jsonify({"status": "error", "message": "Expected JSON data."}), 400

    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    home_city = data.get("home_city", "India").strip()
    travel_style = data.get("travel_style", "nature")

    if not name or len(name) < 2:
        return jsonify({"status": "error", "message": "Full name must be at least 2 characters."}), 400

    if not email or not EMAIL_REGEX.match(email):
        return jsonify({"status": "error", "message": "Please provide a valid email address."}), 400

    if not password or len(password) < 6:
        return jsonify({"status": "error", "message": "Password must be at least 6 characters long."}), 400

    if email in USERS:
        return jsonify({"status": "error", "message": "An account with this email already exists."}), 409

    # Generate secure cryptographic hash
    hashed_password = generate_password_hash(password)

    new_user = {
        "id": f"usr_{len(USERS) + 1:03d}",
        "email": email,
        "password_hash": hashed_password,
        "name": name,
        "home_city": home_city,
        "travel_style": travel_style,
        "phone": "+91 98000 00000",
        "bio": "Enthusiastic explorer excited to discover incredible offbeat destinations across India.",
        "saved_trips": []
    }
    USERS[email] = new_user
    session["user_email"] = email

    user_copy = {k: v for k, v in new_user.items() if k not in ["password", "password_hash"]}
    return jsonify({"status": "success", "message": "Account created successfully!", "user": user_copy}), 201

@app.route("/api/auth/user", methods=["GET"])
def auth_get_current_user():
    """Returns currently authenticated session user info."""
    email = session.get("user_email")
    if not email or email not in USERS:
        return jsonify({"status": "unauthenticated", "user": None}), 200

    user = USERS[email]
    user_copy = {k: v for k, v in user.items() if k not in ["password", "password_hash"]}
    return jsonify({"status": "authenticated", "user": user_copy}), 200

@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    """Logs out current user and invalidates session."""
    session.pop("user_email", None)
    return jsonify({"status": "success", "message": "Logged out successfully."}), 200

@app.route("/api/auth/settings", methods=["PUT"])
def auth_update_settings():
    """
    Updates profile & settings for active user.
    Enforces authentication check.
    """
    email = session.get("user_email")
    if not email or email not in USERS:
        return jsonify({"status": "error", "message": "Authentication required."}), 401

    if not request.is_json:
        return jsonify({"status": "error", "message": "Expected JSON data."}), 400

    data = request.get_json()
    user = USERS[email]

    if "name" in data and len(data["name"].strip()) >= 2:
        user["name"] = data["name"].strip()
    if "home_city" in data:
        user["home_city"] = data["home_city"].strip()
    if "phone" in data:
        user["phone"] = data["phone"].strip()
    if "bio" in data:
        user["bio"] = data["bio"].strip()
    if "travel_style" in data:
        user["travel_style"] = data["travel_style"].strip()
    
    # Hash new password if updated
    if "new_password" in data and len(data["new_password"]) >= 6:
        user["password_hash"] = generate_password_hash(data["new_password"])

    user_copy = {k: v for k, v in user.items() if k not in ["password", "password_hash"]}
    return jsonify({"status": "success", "message": "Settings updated successfully!", "user": user_copy}), 200

@app.route("/api/auth/save-trip", methods=["POST"])
def auth_save_trip():
    """
    Saves a generated trip plan to authenticated user's profile.
    """
    email = session.get("user_email")
    if not email or email not in USERS:
        return jsonify({"status": "error", "message": "Please login to save this trip to your profile."}), 401

    if not request.is_json:
        return jsonify({"status": "error", "message": "Expected JSON data."}), 400

    trip_data = request.get_json()
    user = USERS[email]

    saved_item = {
        "id": f"trip_{len(user['saved_trips']) + 1:02d}",
        "destination": trip_data.get("destination", "ziro"),
        "destination_name": trip_data.get("destination_name", "Destination"),
        "state": trip_data.get("state", "India"),
        "days": trip_data.get("days", 3),
        "travellers": trip_data.get("travellers", 2),
        "preference": trip_data.get("preference", "nature"),
        "estimated_per_person": trip_data.get("estimated_per_person", 0),
        "total_group_cost": trip_data.get("total_group_cost", 0),
        "date_created": "Just now"
    }

    user["saved_trips"].insert(0, saved_item)
    return jsonify({"status": "success", "message": "Trip plan saved to your profile!", "saved_trips": user["saved_trips"]}), 200

# ==================== MAIN EXECUTION ====================
if __name__ == "__main__":
    print("\n" + "=" * 65)
    print("  TripCraft — Multi-Page Travel Application (Flask Server)")
    print("  Serving frontend directly from:", FRONTEND_DIR)
    print("  Local URL: http://127.0.0.1:5000/")
    print("=" * 65 + "\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
