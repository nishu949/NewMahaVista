import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ShopPage from "./pages/ShopPage";
import QuizPage from "./pages/QuizPage";
import ArtistPage from "./pages/ArtistPage";
import DistrictPlanner from "./pages/DistrictPlanner.jsx";
import PlanTripPage from "./pages/PlanTripPage";
import BookingPage from "./pages/BookingPage";
import RecommendationPage from "./pages/RecommendationPage";
import StoriesPage from "./pages/StoriesPage.jsx";
function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="district-planner" element={<DistrictPlanner />} />
        <Route path="/city/:slug" element={<DistrictPlanner />} />
        <Route path="/plan-trip/:slug" element={<PlanTripPage />} />
        <Route path="/booking/:slug" element={<BookingPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
        <Route path="/stories" element={<StoriesPage />} />
      </Routes>
    </Router>
  );
}

export default App;