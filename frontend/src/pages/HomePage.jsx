import Navbar from "../Components/Navbar";
import MapSection from "../Components/MapSection";
import ShopSection from "../Components/ShopSection";
import BottomSlider from "../Components/BottomSlider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCities } from "../services/api";

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

  // You can pass cities data to child components if needed
  // For example: <MapSection cities={cities} />
  // Or <ShopSection cities={cities} />

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-sm">
        <Navbar />
      </div>

      <main className="w-full mt-6 grid grid-cols-12 gap-4 px-2 md:px-4">
        <div className="col-span-12">
          <MapSection />
        </div>

        <div className="col-span-12">
          <ShopSection />
        </div>

        <div className="col-span-12">
          <BottomSlider />
        </div>

        <div className="col-span-12">
          <div
            onClick={() => navigate("/artist")}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white group"
          >
            {/* <div className="grid md:grid-cols-2 items-center">
              <div className="h-[250px] md:h-[320px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80"
                  alt="Artist Shows"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-8 md:p-10">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-700 font-semibold mb-3">
                  Artist Hub
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Explore Artist Shows
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                  Discover Lavani, Bharud, theatre performances and cultural
                  events from across Maharashtra.
                </p>

                <button className="px-6 py-3 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition">
                  Visit Artist Page
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;