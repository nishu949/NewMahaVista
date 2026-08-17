import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Heritage", "Culture", "Festivals", "Food", "Wildlife"];

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = selectedCategory === "All" 
        ? `http://127.0.0.1:8000/api/stories/city/Maharashtra`
        : `http://127.0.0.1:8000/api/stories/city/Maharashtra?category=${selectedCategory}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.status}`);
      }

      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of StoriesPage component (same as before)
};

export default StoriesPage; 