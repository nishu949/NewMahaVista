import random
import re
from typing import Dict, List, Optional


class MysteryService:

    @staticmethod
    def normalize_answer(value: str) -> str:
        """
        Normalize user answers so small differences such as
        capitalization and punctuation do not cause failure.
        """

        if not value:
            return ""

        value = value.strip().lower()

        # Remove punctuation
        value = re.sub(r"[^a-z0-9\s]", "", value)

        # Remove extra spaces
        value = re.sub(r"\s+", " ", value)

        return value

    @classmethod
    def check_answer(
        cls,
        user_answer: str,
        accepted_answers: List[str]
    ) -> bool:

        normalized_user_answer = cls.normalize_answer(
            user_answer
        )

        if not normalized_user_answer:
            return False

        normalized_answers = [
            cls.normalize_answer(answer)
            for answer in accepted_answers
        ]

        return normalized_user_answer in normalized_answers

    @staticmethod
    def calculate_reward(
        clues_used: int
    ) -> Dict:

        if clues_used == 0:
            return {
                "stars": 3,
                "xp": 100,
                "message": "Amazing! You solved the mystery without using a clue."
            }

        if clues_used == 1:
            return {
                "stars": 2,
                "xp": 80,
                "message": "Great job! You solved it with only one clue."
            }

        if clues_used == 2:
            return {
                "stars": 1,
                "xp": 60,
                "message": "Well done! You discovered the answer."
            }

        return {
            "stars": 1,
            "xp": 40,
            "message": "You solved the mystery! Keep exploring Maharashtra."
        }

    @staticmethod
    def sanitize_mystery(
        mystery: Dict
    ) -> Dict:

        mystery["_id"] = str(mystery["_id"])

        # Never send the actual answer to the frontend
        mystery.pop("answer", None)
        mystery.pop("accepted_answers", None)

        return mystery