from typing import List, Dict, Optional, Tuple
from ..database import destinations_collection, festivals_collection


class RecommendationService:
    """
    Personalized recommendation engine for Maharashtra destinations.

    IMPORTANT:
    All recommendations are restricted to Maharashtra.
    """

    def __init__(self):

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

    # ============================================================
    # MAIN SCORING FUNCTION
    # ============================================================

    def calculate_score(
        self,
        destination: Dict,
        preferences: Dict
    ) -> Dict:

        scores = {}

        # --------------------------------------------------------
        # 1. MONTH / SEASON
        # --------------------------------------------------------

        scores["season"] = self._match_season(
            destination.get("best_months", []),
            preferences.get("month")
        )

        # --------------------------------------------------------
        # 2. INTERESTS
        # --------------------------------------------------------

        scores["interests"] = self._match_interests(
            destination.get("categories", []),
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
            preferences.get("month")
        )

        scores["festival"] = festival_score

        # --------------------------------------------------------
        # 5. TRAVEL COMPANION
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
            destination.get("activities", []),
            preferences.get("interests", [])
        )

        # --------------------------------------------------------
        # 9. STARTING CITY
        # --------------------------------------------------------

        scores["distance"] = self._match_distance(
            destination.get("starting_cities", []),
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

        total_score = 0

        for key, weight in self.weights.items():

            component_score = scores.get(key, 0)

            total_score += (
                component_score / 100
            ) * weight

        # --------------------------------------------------------
        # AVOID PREFERENCES
        # --------------------------------------------------------

        penalty = self._calculate_avoid_penalty(
            destination,
            preferences.get("avoid", [])
        )

        total_score -= penalty

        # Keep score between 0 and 100

        total_score = max(
            0,
            min(100, total_score)
        )

        # --------------------------------------------------------
        # GENERATE EXPLANATIONS
        # --------------------------------------------------------

        reasons = self._generate_reasons(
            destination,
            preferences,
            scores,
            festivals
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
    # MONTH / SEASON
    # ============================================================

    def _match_season(
        self,
        best_months: List[str],
        selected_month: Optional[str]
    ) -> float:

        if not selected_month:
            return 70

        if selected_month in best_months:
            return 100

        return 35

    # ============================================================
    # INTEREST MATCH
    # ============================================================

    def _match_interests(
        self,
        categories: List[str],
        interests: List[str]
    ) -> float:

        if not interests:
            return 70

        if not categories:
            return 30

        categories_lower = {
            str(c).lower()
            for c in categories
        }

        interests_lower = {
            str(i).lower()
            for i in interests
        }

        matches = categories_lower.intersection(
            interests_lower
        )

        if not matches:
            return 25

        match_ratio = (
            len(matches) /
            max(len(interests_lower), 1)
        )

        return min(
            100,
            match_ratio * 100
        )

    # ============================================================
    # WEATHER
    # ============================================================

    def _match_weather(
        self,
        weather_data,
        preference: Optional[str],
        month: Optional[str]
    ) -> float:

        if not preference or preference == "No Preference":
            return 75

        if not month:
            return 70

        if not weather_data:
            return 65

        # Support both possible structures:
        #
        # [
        #   {"month": "December", "condition": "Cold"}
        # ]
        #
        # and
        #
        # {
        #   "December": "Cold"
        # }

        condition = ""

        if isinstance(weather_data, list):

            month_weather = next(
                (
                    w for w in weather_data
                    if isinstance(w, dict)
                    and w.get("month") == month
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
                weather_data.get(
                    month,
                    ""
                )
            )

        if not condition:
            return 65

        condition = condition.lower()
        preference = preference.lower()

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
                "wet"
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

        for value in matching_conditions:

            if value in condition:
                return 100

        return 35

    # ============================================================
    # FESTIVAL MATCH
    # ============================================================

    def _match_festival(
        self,
        destination: Dict,
        month: Optional[str]
    ) -> Tuple[float, List[Dict]]:

        if not month:
            return 0, []

        destination_name = destination.get(
            "name",
            ""
        )

        district = destination.get(
            "district",
            ""
        )

        query = {
            "state": "Maharashtra",
            "month": month,
            "is_active": True
        }

        festivals = list(
            festivals_collection.find(query)
        )

        matching_festivals = []

        for festival in festivals:

            related_destinations = festival.get(
                "related_destinations",
                []
            )

            festival_district = festival.get(
                "district",
                ""
            )

            if (
                destination_name in related_destinations
                or district == festival_district
            ):
                festival["_id"] = str(
                    festival["_id"]
                )

                matching_festivals.append(
                    festival
                )

        if matching_festivals:
            return 100, matching_festivals

        # Festival exists in Maharashtra
        # but not specifically at this destination.

        if festivals:
            return 30, []

        return 0, []

    # ============================================================
    # TRAVEL COMPANION
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

        ideal_lower = [
            str(x).lower()
            for x in ideal_for
        ]

        if companion.lower() in ideal_lower:
            return 100

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
            "Budget": 1,
            "Moderate": 2,
            "Premium": 3,
            "Luxury": 4
        }

        dest_level = budget_map.get(
            destination_budget,
            2
        )

        pref_level = budget_map.get(
            preferred_budget,
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

        duration = duration.lower()

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
            return 70

        if difference <= 4:
            return 45

        return 25

    # ============================================================
    # ACTIVITIES
    # ============================================================

    def _match_activities(
        self,
        activities: List[str],
        interests: List[str]
    ) -> float:

        if not interests:
            return 70

        if not activities:
            return 50

        activity_map = {

            "Nature": [
                "Sightseeing",
                "Photography",
                "Nature Walks",
                "Trekking"
            ],

            "Heritage": [
                "Sightseeing",
                "Historical Tours",
                "Museum Visits",
                "Heritage Walks"
            ],

            "Culture": [
                "Cultural Tours",
                "Heritage Walks",
                "Museum Visits"
            ],

            "Festivals": [
                "Local Festivals",
                "Celebrations",
                "Cultural Tours"
            ],

            "Food": [
                "Food Tasting",
                "Culinary Tours",
                "Local Cuisine"
            ],

            "Wildlife": [
                "Wildlife Safaris",
                "Bird Watching",
                "Nature Walks"
            ],

            "Beaches": [
                "Beach Activities",
                "Water Sports",
                "Boating"
            ],

            "Adventure": [
                "Trekking",
                "Rock Climbing",
                "Paragliding",
                "Water Sports"
            ],

            "Spiritual": [
                "Temple Visits",
                "Spiritual Tours",
                "Meditation"
            ],

            "Photography": [
                "Photography",
                "Scenic Views",
                "Sightseeing"
            ],

            "Family": [
                "Sightseeing",
                "Boating",
                "Garden Visits"
            ],

            "Shopping": [
                "Shopping",
                "Local Markets",
                "Handicrafts"
            ]
        }

        matched = 0

        for interest in interests:

            related = activity_map.get(
                interest,
                []
            )

            matched += sum(
                1
                for activity in activities
                if activity in related
            )

        if matched == 0:
            return 30

        return min(
            100,
            matched * 25
        )

    # ============================================================
    # STARTING CITY
    # ============================================================

    def _match_distance(
        self,
        starting_cities: List[str],
        starting_city: Optional[str]
    ) -> float:

        if not starting_city:
            return 70

        if not starting_cities:
            return 60

        if starting_city in starting_cities:
            return 100

        return 55

    # ============================================================
    # ADVENTURE LEVEL
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
            "Relaxed": 1,
            "Moderate": 2,
            "Adventurous": 3,
            "Extreme": 4
        }

        dest = levels.get(
            destination_difficulty,
            2
        )

        pref = levels.get(
            preferred_level,
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
    # AVOID PREFERENCES
    # ============================================================

    def _calculate_avoid_penalty(
        self,
        destination: Dict,
        avoid: List[str]
    ) -> float:

        if not avoid:
            return 0

        penalty = 0

        tags = [
            str(x).lower()
            for x in destination.get(
                "tags",
                []
            )
        ]

        activities = [
            str(x).lower()
            for x in destination.get(
                "activities",
                []
            )
        ]

        difficulty = str(
            destination.get(
                "difficulty",
                ""
            )
        ).lower()

        combined = tags + activities

        for item in avoid:

            item_lower = item.lower()

            if item_lower == "long trekking":

                if (
                    "trekking" in combined
                    or difficulty in [
                        "adventurous",
                        "extreme"
                    ]
                ):
                    penalty += 8

            elif item_lower == "hot weather":

                if "hot" in combined:
                    penalty += 8

            elif item_lower == "heavy rain":

                if "rain" in combined:
                    penalty += 8

            elif item_lower == "difficult activities":

                if difficulty in [
                    "adventurous",
                    "extreme"
                ]:
                    penalty += 8

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
        festivals: List[Dict]
    ) -> List[str]:

        reasons = []

        month = preferences.get(
            "month"
        )

        # Month

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

        matched_categories = [
            category
            for category in destination.get(
                "categories",
                []
            )
            if category in interests
        ]

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

        # Festival

        if festivals:

            festival_name = festivals[0].get(
                "name",
                "Festival"
            )

            reasons.append(
                f"Festival: {festival_name}"
            )

        # Default

        if not reasons:

            reasons.append(
                "Highly recommended Maharashtra destination"
            )

            reasons.append(
                "Offers unique travel experiences"
            )

        return reasons[:5]


# ==================================================================
# MAIN RECOMMENDATION FUNCTION
# ==================================================================

def get_recommendations(
    preferences: Dict
) -> Dict:

    service = RecommendationService()

    # --------------------------------------------------------------
    # IMPORTANT:
    # DO NOT FILTER BY INTEREST/BUDGET/DURATION HERE.
    #
    # We want the scoring engine to evaluate all Maharashtra
    # destinations and rank them.
    # --------------------------------------------------------------

    query = {
        "state": "Maharashtra",
        "is_active": True
    }

    # --------------------------------------------------------------
    # Candidate destinations
    # --------------------------------------------------------------

    destinations = list(
        destinations_collection.find(
            query
        )
        .sort(
            [
                ("popularity_score", -1)
            ]
        )
        .limit(100)
    )

    # --------------------------------------------------------------
    # Calculate score for every candidate
    # --------------------------------------------------------------

    scored_destinations = []

    for destination in destinations:

        result = service.calculate_score(
            destination,
            preferences
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
    # Sort by personalized score
    # --------------------------------------------------------------

    scored_destinations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    # --------------------------------------------------------------
    # Top 10
    # --------------------------------------------------------------

    top_recommendations = (
        scored_destinations[:10]
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