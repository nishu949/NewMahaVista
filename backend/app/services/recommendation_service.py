from typing import List, Dict, Optional, Tuple
from math import radians, sin, cos, sqrt, atan2

from ..database import destinations_collection, festivals_collection


class RecommendationService:
    """
    Practical personalized recommendation engine for Maharashtra.

    Design goals:
    - Keep the existing 100-point weighted model.
    - Use the existing MongoDB destination/festival data.
    - Avoid ML/vector databases/extra dependencies.
    - Produce explainable recommendations.
    - Keep the existing API response structure compatible.
    """

    def __init__(self):

        # Keep the existing weights.
        # Total = 100
        self.weights = {
            "season": 20,
            "interests": 20,
            "weather": 15,
            "festival": 10,
            "companion": 8,
            "budget": 8,
            "duration": 7,
            "activities": 5,
            "distance": 4,
            "adventure": 3
        }

        # Approximate coordinates for common Maharashtra starting cities.
        # This is only used when the destination has latitude/longitude.
        #
        # If a destination explicitly lists the starting city in
        # starting_cities, that remains the strongest signal.
        self.city_coordinates = {
            "mumbai": (19.0760, 72.8777),
            "pune": (18.5204, 73.8567),
            "nagpur": (21.1458, 79.0882),
            "nashik": (19.9975, 73.7898),
            "aurangabad": (19.8762, 75.3433),
            "chhatrapati sambhaji nagar": (19.8762, 75.3433),
            "sambhajinagar": (19.8762, 75.3433),
            "kolhapur": (16.7050, 74.2433),
            "solapur": (17.6599, 75.9064),
            "satara": (17.6805, 74.0183),
            "thane": (19.2183, 72.9781),
            "navi mumbai": (19.0330, 73.0297),
            "amravati": (20.9374, 77.7796),
            "jalgaon": (21.0077, 75.5626),
            "akola": (20.7002, 77.0082),
            "latur": (18.4088, 76.5604),
            "nanded": (19.1383, 77.3210),
            "ratnagiri": (16.9902, 73.3120),
            "sangli": (16.8524, 74.5815),
            "ahmednagar": (19.0948, 74.7480),
            "ahilyanagar": (19.0948, 74.7480),
            "dhule": (20.9042, 74.7749),
            "beed": (18.9891, 75.7601),
            "chandrapur": (19.9615, 79.2961),
            "wardha": (20.7453, 78.6022),
            "yavatmal": (20.3888, 78.1204),
        }

        # Related interests help the recommender understand that
        # interests such as Nature and Photography can overlap.
        self.interest_activity_map = {

            "nature": [
                "sightseeing",
                "photography",
                "nature walks",
                "bird watching",
                "wildlife safaris",
                "trekking",
                "boating",
                "scenic views",
                "waterfalls"
            ],

            "heritage": [
                "sightseeing",
                "historical tours",
                "museum visits",
                "heritage walks",
                "fort exploration",
                "fort visits",
                "cave exploration"
            ],

            "culture": [
                "cultural tours",
                "heritage walks",
                "museum visits",
                "local festivals",
                "celebrations",
                "traditional experiences"
            ],

            "festival": [
                "local festivals",
                "celebrations",
                "cultural tours"
            ],

            "festivals": [
                "local festivals",
                "celebrations",
                "cultural tours"
            ],

            "food": [
                "food tasting",
                "culinary tours",
                "local cuisine",
                "street food",
                "food tours"
            ],

            "wildlife": [
                "wildlife safaris",
                "bird watching",
                "nature walks",
                "photography",
                "safari"
            ],

            "beaches": [
                "beach activities",
                "water sports",
                "boating",
                "swimming",
                "photography"
            ],

            "adventure": [
                "trekking",
                "rock climbing",
                "paragliding",
                "water sports",
                "camping",
                "rafting"
            ],

            "spiritual": [
                "temple visits",
                "spiritual tours",
                "meditation",
                "pilgrimage"
            ],

            "photography": [
                "photography",
                "scenic views",
                "sightseeing",
                "bird watching",
                "wildlife safaris",
                "heritage walks",
                "beach activities"
            ],

            "shopping": [
                "shopping",
                "local markets",
                "handicrafts"
            ],

            "family": [
                "sightseeing",
                "boating",
                "garden visits",
                "museum visits",
                "nature walks"
            ],
        }

        # Some categories are naturally related.
        self.interest_aliases = {
            "nature": ["nature", "outdoors", "scenery"],
            "heritage": ["heritage", "history", "historical"],
            "culture": ["culture", "cultural"],
            "wildlife": ["wildlife", "animals", "safari"],
            "beaches": ["beaches", "beach", "coastal"],
            "photography": ["photography", "photo"],
            "food": ["food", "cuisine", "culinary"],
            "spiritual": ["spiritual", "religious", "pilgrimage"],
            "adventure": ["adventure", "adventurous"],
            "shopping": ["shopping", "markets"],
        }

    # ============================================================
    # MAIN SCORING FUNCTION
    # ============================================================

    def calculate_score(
        self,
        destination: Dict,
        preferences: Dict,
        festivals_by_month: Optional[List[Dict]] = None
    ) -> Dict:

        scores = {}

        # --------------------------------------------------------
        # 1. SEASON
        # --------------------------------------------------------

        scores["season"] = self._match_season(
            destination.get("best_months", []),
            preferences.get("month")
        )

        # --------------------------------------------------------
        # 2. INTERESTS
        # --------------------------------------------------------

        scores["interests"] = self._match_interests(
            destination,
            preferences.get("interests", [])
        )

        # --------------------------------------------------------
        # 3. WEATHER
        # --------------------------------------------------------

        scores["weather"] = self._match_weather(
            destination.get("weather", []),
            preferences.get("weather_preference"),
            preferences.get("month")
        )

        # --------------------------------------------------------
        # 4. FESTIVAL
        # --------------------------------------------------------

        festival_score, festivals = self._match_festival(
            destination,
            preferences.get("month"),
            festivals_by_month
        )

        scores["festival"] = festival_score

        # --------------------------------------------------------
        # 5. COMPANION
        # --------------------------------------------------------

        scores["companion"] = self._match_companion(
            destination.get("ideal_for", []),
            preferences.get("travel_with")
        )

        # --------------------------------------------------------
        # 6. BUDGET
        # --------------------------------------------------------

        scores["budget"] = self._match_budget(
            destination.get("budget"),
            preferences.get("budget")
        )

        # --------------------------------------------------------
        # 7. DURATION
        # --------------------------------------------------------

        scores["duration"] = self._match_duration(
            destination.get("recommended_duration"),
            preferences.get("duration")
        )

        # --------------------------------------------------------
        # 8. ACTIVITIES
        # --------------------------------------------------------

        scores["activities"] = self._match_activities(
            destination,
            preferences.get("interests", [])
        )

        # --------------------------------------------------------
        # 9. DISTANCE / STARTING CITY
        # --------------------------------------------------------

        scores["distance"] = self._match_distance(
            destination,
            preferences.get("starting_city")
        )

        # --------------------------------------------------------
        # 10. ADVENTURE
        # --------------------------------------------------------

        scores["adventure"] = self._match_adventure(
            destination.get("difficulty"),
            preferences.get("adventure_level")
        )

        # --------------------------------------------------------
        # WEIGHTED SCORE
        # --------------------------------------------------------

        total_score = 0.0

        for key, weight in self.weights.items():

            component_score = scores.get(key, 0)

            total_score += (
                component_score / 100.0
            ) * weight

        # --------------------------------------------------------
        # TRANSPORT ADJUSTMENT
        #
        # Transport isn't part of the original 100-point model.
        # We use a very small adjustment so it can influence ranking
        # without destroying your original weighting.
        # --------------------------------------------------------

        transport_score = self._match_transport(
            destination.get("transport", []),
            preferences.get("transport")
        )

        if (
            preferences.get("transport")
            and preferences.get("transport") != "No Preference"
        ):
            # Maximum +1.5 / -1.5 points.
            if transport_score >= 90:
                total_score += 1.5
            elif transport_score <= 35:
                total_score -= 1.5

        # --------------------------------------------------------
        # AVOID PENALTY
        # --------------------------------------------------------

        penalty = self._calculate_avoid_penalty(
            destination,
            preferences.get("avoid", [])
        )

        total_score -= penalty

        total_score = max(
            0,
            min(100, total_score)
        )

        # --------------------------------------------------------
        # REASONS
        # --------------------------------------------------------

        reasons = self._generate_reasons(
            destination,
            preferences,
            scores,
            festivals,
            transport_score
        )

        return {
            "score": round(total_score, 1),
            "breakdown": scores,
            "reasons": reasons,
            "festival": festivals[0] if festivals else None,
            "festivals": festivals,
            "penalty": penalty
        }

    # ============================================================
    # SEASON
    # ============================================================

    def _match_season(
        self,
        best_months: List[str],
        selected_month: Optional[str]
    ) -> float:

        if not selected_month:
            return 70

        selected = str(selected_month).strip().lower()

        months = {
            str(month).strip().lower()
            for month in best_months
        }

        if selected in months:
            return 100

        # If there is no exact match, don't completely eliminate
        # the destination. It may still be a reasonable destination.
        return 35

    # ============================================================
    # INTERESTS
    # ============================================================

    def _match_interests(
        self,
        destination: Dict,
        interests: List[str]
    ) -> float:

        if not interests:
            return 70

        categories = self._normalize_list(
            destination.get("categories", [])
        )

        tags = self._normalize_list(
            destination.get("tags", [])
        )

        activities = self._normalize_list(
            destination.get("activities", [])
        )

        if not categories and not tags and not activities:
            return 25

        matched = 0.0

        for interest in interests:

            interest_key = self._normalize(interest)

            # Direct category match = strongest.
            if interest_key in categories:
                matched += 1.0
                continue

            # Tag match.
            if any(
                interest_key in tag
                or tag in interest_key
                for tag in tags
            ):
                matched += 0.85
                continue

            # Related category aliases.
            aliases = self.interest_aliases.get(
                interest_key,
                [interest_key]
            )

            if any(
                alias in categories
                for alias in aliases
            ):
                matched += 0.75
                continue

            # Activity relevance.
            related_activities = self.interest_activity_map.get(
                interest_key,
                []
            )

            activity_matches = sum(
                1
                for activity in activities
                if any(
                    related.lower() in activity
                    or activity in related.lower()
                    for related in related_activities
                )
            )

            if activity_matches:
                matched += 0.65

        ratio = matched / max(len(interests), 1)

        if ratio >= 1:
            return 100

        if ratio >= 0.75:
            return 90

        if ratio >= 0.50:
            return 70

        if ratio > 0:
            return 50

        return 20

    # ============================================================
    # WEATHER
    # ============================================================

    def _match_weather(
        self,
        weather_data,
        preference: Optional[str],
        month: Optional[str]
    ) -> float:

        if (
            not preference
            or preference == "No Preference"
        ):
            return 75

        if not month:
            return 70

        if not weather_data:
            return 65

        condition = ""

        if isinstance(weather_data, list):

            month_weather = next(
                (
                    item for item in weather_data
                    if isinstance(item, dict)
                    and self._normalize(
                        item.get("month", "")
                    ) == self._normalize(month)
                ),
                None
            )

            if month_weather:
                condition = str(
                    month_weather.get(
                        "condition",
                        ""
                    )
                )

        elif isinstance(weather_data, dict):

            condition = str(
                weather_data.get(month, "")
            )

        if not condition:
            return 65

        condition = self._normalize(condition)
        preference = self._normalize(preference)

        weather_map = {
            "cold": [
                "cold",
                "cool",
                "chilly",
                "winter"
            ],
            "pleasant": [
                "pleasant",
                "mild",
                "moderate",
                "comfortable"
            ],
            "rainy": [
                "rainy",
                "monsoon",
                "wet",
                "rain"
            ],
            "warm": [
                "warm",
                "hot",
                "sunny"
            ]
        }

        matching_conditions = weather_map.get(
            preference,
            []
        )

        if any(
            value in condition
            for value in matching_conditions
        ):
            return 100

        # Related/neutral conditions are preferable to
        # completely opposite conditions.
        if preference == "pleasant":
            if any(
                value in condition
                for value in [
                    "cool",
                    "comfortable",
                    "mild"
                ]
            ):
                return 85

        return 30

    # ============================================================
    # FESTIVAL
    # ============================================================

    def _match_festival(
        self,
        destination: Dict,
        month: Optional[str],
        festivals_by_month: Optional[List[Dict]] = None
    ) -> Tuple[float, List[Dict]]:

        if not month:
            return 0, []

        if festivals_by_month is None:

            festivals_by_month = list(
                festivals_collection.find({
                    "state": "Maharashtra",
                    "month": month,
                    "is_active": True
                })
            )

        destination_name = self._normalize(
            destination.get("name", "")
        )

        district = self._normalize(
            destination.get("district", "")
        )

        matching_festivals = []

        for festival in festivals_by_month:

            related_destinations = [
                self._normalize(x)
                for x in festival.get(
                    "related_destinations",
                    []
                )
            ]

            festival_district = self._normalize(
                festival.get("district", "")
            )

            # Direct destination relationship.
            if destination_name in related_destinations:
                festival["_id"] = str(
                    festival["_id"]
                )

                matching_festivals.append(
                    festival
                )
                continue

            # Same district.
            if (
                district
                and festival_district
                and district == festival_district
            ):
                festival["_id"] = str(
                    festival["_id"]
                )

                matching_festivals.append(
                    festival
                )

        if matching_festivals:
            return 100, matching_festivals

        # Festival exists during the selected month,
        # but is not directly associated with this destination.
        if festivals_by_month:
            return 30, []

        return 0, []

    # ============================================================
    # COMPANION
    # ============================================================

    def _match_companion(
        self,
        ideal_for: List[str],
        companion: Optional[str]
    ) -> float:

        if not companion:
            return 70

        if not ideal_for:
            return 60

        companion = self._normalize(companion)

        ideal_lower = [
            self._normalize(item)
            for item in ideal_for
        ]

        if companion in ideal_lower:
            return 100

        # Family can reasonably include children/group travel.
        if (
            companion == "family"
            and any(
                item in ideal_lower
                for item in [
                    "friends",
                    "couple"
                ]
            )
        ):
            return 65

        return 40

    # ============================================================
    # BUDGET
    # ============================================================

    def _match_budget(
        self,
        destination_budget: Optional[str],
        preferred_budget: Optional[str]
    ) -> float:

        if not preferred_budget:
            return 70

        budget_map = {
            "budget": 1,
            "moderate": 2,
            "premium": 3,
            "luxury": 4
        }

        dest_level = budget_map.get(
            self._normalize(destination_budget),
            2
        )

        pref_level = budget_map.get(
            self._normalize(preferred_budget),
            2
        )

        difference = abs(
            dest_level - pref_level
        )

        if difference == 0:
            return 100

        if difference == 1:
            return 65

        return 30

    # ============================================================
    # DURATION
    # ============================================================

    def _parse_duration(
        self,
        duration: Optional[str]
    ) -> int:

        if not duration:
            return 3

        duration = self._normalize(duration)

        if "1 day" in duration:
            return 1

        if "2-3" in duration:
            return 3

        if "4-5" in duration:
            return 5

        if "6-7" in duration:
            return 7

        if "7+" in duration:
            return 10

        return 3

    def _match_duration(
        self,
        destination_duration: Optional[str],
        preferred_duration: Optional[str]
    ) -> float:

        if not preferred_duration:
            return 70

        dest_days = self._parse_duration(
            destination_duration
        )

        preferred_days = self._parse_duration(
            preferred_duration
        )

        difference = abs(
            dest_days - preferred_days
        )

        if difference == 0:
            return 100

        if difference <= 2:
            return 75

        if difference <= 4:
            return 50

        return 25

    # ============================================================
    # ACTIVITIES
    # ============================================================

    def _match_activities(
        self,
        destination: Dict,
        interests: List[str]
    ) -> float:

        if not interests:
            return 70

        activities = self._normalize_list(
            destination.get("activities", [])
        )

        if not activities:
            return 50

        matched_interests = 0

        for interest in interests:

            interest_key = self._normalize(
                interest
            )

            related = self.interest_activity_map.get(
                interest_key,
                []
            )

            if any(
                any(
                    related_activity.lower() in activity
                    or activity in related_activity.lower()
                    for related_activity in related
                )
                for activity in activities
            ):
                matched_interests += 1

        ratio = (
            matched_interests /
            max(len(interests), 1)
        )

        if ratio >= 1:
            return 100

        if ratio >= 0.5:
            return 75

        if ratio > 0:
            return 55

        return 25

    # ============================================================
    # DISTANCE / STARTING CITY
    # ============================================================

    def _match_distance(
        self,
        destination: Dict,
        starting_city: Optional[str]
    ) -> float:

        if not starting_city:
            return 70

        starting_city_normalized = self._normalize(
            starting_city
        )

        starting_cities = [
            self._normalize(city)
            for city in destination.get(
                "starting_cities",
                []
            )
        ]

        # Explicitly supported starting city is the
        # strongest signal in the existing database.
        if starting_city_normalized in starting_cities:
            return 100

        # If we have coordinates, calculate actual distance.
        user_coordinates = self.city_coordinates.get(
            starting_city_normalized
        )

        destination_lat = destination.get("latitude")
        destination_lng = destination.get("longitude")

        if (
            user_coordinates
            and self._valid_coordinate(destination_lat)
            and self._valid_coordinate(destination_lng)
        ):

            distance_km = self._haversine_distance(
                user_coordinates[0],
                user_coordinates[1],
                float(destination_lat),
                float(destination_lng)
            )

            if distance_km <= 100:
                return 100

            if distance_km <= 200:
                return 95

            if distance_km <= 300:
                return 88

            if distance_km <= 400:
                return 78

            if distance_km <= 550:
                return 68

            if distance_km <= 700:
                return 55

            if distance_km <= 900:
                return 42

            return 30

        # Fallback when coordinates are unavailable.
        return 55

    # ============================================================
    # TRANSPORT
    # ============================================================

    def _match_transport(
        self,
        destination_transport: List[str],
        preferred_transport: Optional[str]
    ) -> float:

        if (
            not preferred_transport
            or preferred_transport == "No Preference"
        ):
            return 75

        if not destination_transport:
            return 55

        preferred = self._normalize(
            preferred_transport
        )

        available = self._normalize_list(
            destination_transport
        )

        if preferred in available:
            return 100

        # Public transport aliases.
        if preferred in [
            "public transport",
            "public",
            "bus"
        ]:
            if any(
                item in available
                for item in [
                    "bus",
                    "train",
                    "public transport"
                ]
            ):
                return 90

        return 30

    # ============================================================
    # ADVENTURE
    # ============================================================

    def _match_adventure(
        self,
        destination_difficulty: Optional[str],
        preferred_level: Optional[str]
    ) -> float:

        if not preferred_level:
            return 70

        if not destination_difficulty:
            return 60

        levels = {
            "easy": 1,
            "relaxed": 1,
            "moderate": 2,
            "adventurous": 3,
            "difficult": 3,
            "extreme": 4
        }

        dest = levels.get(
            self._normalize(destination_difficulty),
            2
        )

        pref = levels.get(
            self._normalize(preferred_level),
            2
        )

        difference = abs(
            dest - pref
        )

        if difference == 0:
            return 100

        if difference == 1:
            return 70

        return 35

    # ============================================================
    # AVOID
    # ============================================================

    def _calculate_avoid_penalty(
        self,
        destination: Dict,
        avoid: List[str]
    ) -> float:

        if not avoid:
            return 0

        penalty = 0

        tags = self._normalize_list(
            destination.get("tags", [])
        )

        activities = self._normalize_list(
            destination.get("activities", [])
        )

        categories = self._normalize_list(
            destination.get("categories", [])
        )

        difficulty = self._normalize(
            destination.get("difficulty", "")
        )

        combined = (
            tags +
            activities +
            categories
        )

        for item in avoid:

            item_lower = self._normalize(item)

            if item_lower == "long trekking":

                if (
                    "trekking" in combined
                    or difficulty in [
                        "adventurous",
                        "extreme",
                        "difficult"
                    ]
                ):
                    penalty += 10

            elif item_lower == "hot weather":

                weather_text = self._destination_weather_text(
                    destination
                )

                if any(
                    value in weather_text
                    for value in [
                        "hot",
                        "warm",
                        "sunny"
                    ]
                ):
                    penalty += 8

            elif item_lower == "heavy rain":

                weather_text = self._destination_weather_text(
                    destination
                )

                if any(
                    value in weather_text
                    for value in [
                        "rain",
                        "rainy",
                        "monsoon",
                        "wet"
                    ]
                ):
                    penalty += 8

            elif item_lower == "difficult activities":

                if difficulty in [
                    "adventurous",
                    "extreme",
                    "difficult"
                ]:
                    penalty += 10

            elif item_lower == "crowded places":

                if any(
                    word in combined
                    for word in [
                        "crowded",
                        "popular",
                        "busy"
                    ]
                ):
                    penalty += 8

        return min(
            penalty,
            25
        )

    # ============================================================
    # REASONS
    # ============================================================

    def _generate_reasons(
        self,
        destination: Dict,
        preferences: Dict,
        scores: Dict,
        festivals: List[Dict],
        transport_score: float
    ) -> List[str]:

        reasons = []

        month = preferences.get("month")

        # Season
        if (
            month
            and month in destination.get(
                "best_months",
                []
            )
        ):
            reasons.append(
                f"Excellent for {month}"
            )

        # Weather
        weather = preferences.get(
            "weather_preference"
        )

        if (
            weather
            and weather != "No Preference"
            and scores.get("weather", 0) >= 80
        ):
            reasons.append(
                f"Matches your {weather.lower()} weather preference"
            )

        # Interests
        interests = preferences.get(
            "interests",
            []
        )

        categories = destination.get(
            "categories",
            []
        )

        matched_categories = []

        for interest in interests:

            interest_normalized = self._normalize(
                interest
            )

            for category in categories:

                if (
                    self._normalize(category)
                    == interest_normalized
                ):
                    matched_categories.append(
                        category
                    )
                    break

        for category in matched_categories[:2]:
            reasons.append(
                f"Great for {category}"
            )

        # Companion
        companion = preferences.get(
            "travel_with"
        )

        if (
            companion
            and companion in destination.get(
                "ideal_for",
                []
            )
        ):
            reasons.append(
                f"Well suited for {companion.lower()} trips"
            )

        # Budget
        budget = preferences.get(
            "budget"
        )

        if (
            budget
            and budget == destination.get(
                "budget"
            )
        ):
            reasons.append(
                f"Fits your {budget.lower()} budget"
            )

        # Duration
        duration = preferences.get(
            "duration"
        )

        if (
            duration
            and duration == destination.get(
                "recommended_duration"
            )
        ):
            reasons.append(
                f"Ideal for a {duration.lower()} trip"
            )

        # Starting city
        starting_city = preferences.get(
            "starting_city"
        )

        if starting_city:

            starting_cities = [
                self._normalize(city)
                for city in destination.get(
                    "starting_cities",
                    []
                )
            ]

            if self._normalize(starting_city) in starting_cities:
                reasons.append(
                    f"Convenient from {starting_city}"
                )

        # Transport
        transport = preferences.get(
            "transport"
        )

        if (
            transport
            and transport != "No Preference"
            and transport_score >= 90
        ):
            reasons.append(
                f"Works well with {transport.lower()} travel"
            )

        # Festival
        if festivals:

            festival_name = festivals[0].get(
                "name",
                "Festival"
            )

            reasons.append(
                f"Festival: {festival_name}"
            )

        # Fallback
        if not reasons:

            reasons.append(
                "Strong overall match for your travel preferences"
            )

            reasons.append(
                "Offers a distinctive Maharashtra travel experience"
            )

        return reasons[:5]

    # ============================================================
    # HELPERS
    # ============================================================

    @staticmethod
    def _normalize(value) -> str:

        if value is None:
            return ""

        return (
            str(value)
            .strip()
            .lower()
            .replace("_", " ")
            .replace("-", " ")
        )

    def _normalize_list(
        self,
        values
    ) -> List[str]:

        if not isinstance(values, list):
            return []

        return [
            self._normalize(value)
            for value in values
            if value is not None
        ]

    @staticmethod
    def _valid_coordinate(value) -> bool:

        if value is None:
            return False

        try:
            float(value)
            return True
        except (
            TypeError,
            ValueError
        ):
            return False

    @staticmethod
    def _haversine_distance(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> float:

        earth_radius_km = 6371.0

        lat1 = radians(lat1)
        lon1 = radians(lon1)
        lat2 = radians(lat2)
        lon2 = radians(lon2)

        delta_lat = lat2 - lat1
        delta_lon = lon2 - lon1

        a = (
            sin(delta_lat / 2) ** 2
            +
            cos(lat1)
            * cos(lat2)
            * sin(delta_lon / 2) ** 2
        )

        c = 2 * atan2(
            sqrt(a),
            sqrt(1 - a)
        )

        return earth_radius_km * c

    def _destination_weather_text(
        self,
        destination: Dict
    ) -> str:

        weather = destination.get(
            "weather",
            []
        )

        values = []

        if isinstance(weather, list):

            for item in weather:

                if isinstance(item, dict):
                    values.append(
                        str(
                            item.get(
                                "condition",
                                ""
                            )
                        )
                    )

        elif isinstance(weather, dict):

            values.extend(
                str(value)
                for value in weather.values()
            )

        return self._normalize(
            " ".join(values)
        )


# ==================================================================
# MAIN RECOMMENDATION FUNCTION
# ==================================================================

def get_recommendations(
    preferences: Dict
) -> Dict:

    service = RecommendationService()

    # --------------------------------------------------------------
    # All active Maharashtra destinations are candidates.
    #
    # Do NOT pre-filter by interests/budget/duration because
    # the scoring engine should decide the ranking.
    # --------------------------------------------------------------

    query = {
        "state": "Maharashtra",
        "is_active": True
    }

    destinations = list(
        destinations_collection.find(query)
    )

    # --------------------------------------------------------------
    # Fetch festivals ONCE for the selected month.
    #
    # The previous implementation queried MongoDB once per
    # destination. This avoids that repeated database work.
    # --------------------------------------------------------------

    selected_month = preferences.get(
        "month"
    )

    festivals_by_month = []

    if selected_month:

        festivals_by_month = list(
            festivals_collection.find({
                "state": "Maharashtra",
                "month": selected_month,
                "is_active": True
            })
        )

    # --------------------------------------------------------------
    # Calculate personalized score for every destination.
    # --------------------------------------------------------------

    scored_destinations = []

    for destination in destinations:

        result = service.calculate_score(
            destination,
            preferences,
            festivals_by_month
        )

        destination["_id"] = str(
            destination["_id"]
        )

        scored_destinations.append({

            "destination": destination,

            "score": result["score"],

            "breakdown": result["breakdown"],

            "reasons": result["reasons"],

            "festival": result["festival"],

            "festivals": result["festivals"],

            "penalty": result["penalty"]
        })

    # --------------------------------------------------------------
    # Sort by personalized score.
    #
    # Popularity is only used as a tie-breaker.
    # It should NOT decide which destinations enter the candidate pool.
    # --------------------------------------------------------------

    scored_destinations.sort(
        key=lambda item: (
            item["score"],
            item["destination"].get(
                "popularity_score",
                0
            )
        ),
        reverse=True
    )

    # --------------------------------------------------------------
    # Diversity-aware top 10
    #
    # Prevent the first results from being almost identical.
    # We only use this as a light reranking step.
    # --------------------------------------------------------------

    top_recommendations = _diversify_recommendations(
        scored_destinations,
        limit=10
    )

    return {

        "recommendations":
            top_recommendations,

        "total_matches":
            len(scored_destinations),

        "preferences":
            preferences,

        "region":
            "Maharashtra",

        "algorithm":
            "Weighted Personalized Recommendation"

    }


# ==================================================================
# LIGHT DIVERSITY RERANKING
# ==================================================================

def _diversify_recommendations(
    recommendations: List[Dict],
    limit: int = 10
) -> List[Dict]:

    if len(recommendations) <= limit:
        return recommendations

    selected = []
    used_categories = set()

    # First result is always the highest scoring destination.
    selected.append(
        recommendations[0]
    )

    used_categories.update(
        _normalized_categories(
            recommendations[0]["destination"]
        )
    )

    remaining = recommendations[1:]

    while (
        remaining
        and len(selected) < limit
    ):

        best_index = 0
        best_value = float("-inf")

        for index, item in enumerate(remaining):

            destination = item["destination"]

            categories = _normalized_categories(
                destination
            )

            overlap = len(
                categories.intersection(
                    used_categories
                )
            )

            # Small diversity bonus.
            diversity_bonus = 0

            if overlap == 0:
                diversity_bonus = 1.5

            elif overlap == 1:
                diversity_bonus = 0.5

            candidate_value = (
                item["score"]
                + diversity_bonus
            )

            if candidate_value > best_value:

                best_value = candidate_value
                best_index = index

        selected_item = remaining.pop(
            best_index
        )

        selected.append(
            selected_item
        )

        used_categories.update(
            _normalized_categories(
                selected_item["destination"]
            )
        )

    return selected


def _normalized_categories(
    destination: Dict
) -> set:

    categories = destination.get(
        "categories",
        []
    )

    if not isinstance(categories, list):
        return set()

    return {
        str(category).strip().lower()
        for category in categories
        if category
    }