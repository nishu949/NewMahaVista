import Navbar from "../Components/Navbar";
import MapSection from "../Components/MapSection";
import ShopSection from "../Components/ShopSection";
import BottomSlider from "../Components/BottomSlider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCities } from "../services/api";
import KidsSection from "/src/Components/KidsSection.jsx";
import RecommendationCard from "../Components/RecommendationCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCities();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-sm">
        <Navbar />
      </div>

      <main className="w-full mt-6 grid grid-cols-12 gap-4 px-2 md:px-4">

        {/* ================= MAP ================= */}
        <div
          id="map-section"
          className="col-span-12 scroll-mt-20"
        >
          <MapSection />
        </div>

        {/* ================= PERSONALIZED RECOMMENDATIONS ================= */}
        <div className="col-span-12">
          <RecommendationCard />
        </div>

        {/* ================= KIDS CORNER ================= */}
        <div
          id="kids-section"
          className="col-span-12 scroll-mt-20"
        >
          <KidsSection />
        </div>

        {/* ================= SHOP ================= */}
        <div
          id="shop-section"
          className="col-span-12 scroll-mt-20"
        >
          <ShopSection />
        </div>

        {/* ================= BOOKINGS ================= */}
        <div
          id="bookings-section"
          className="col-span-12 scroll-mt-20"
        >
          {/* Add your Bookings component here when ready */}
        </div>

      </main>
    </div>
  );
};

export default HomePage;