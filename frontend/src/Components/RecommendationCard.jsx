import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecommendationCard = () => {
  const navigate = useNavigate();

  return (
  <section className="w-full py-6 md:py-10">
  <button
    onClick={() => navigate("/recommendations")}
    className="group relative w-full min-h-[280px] md:min-h-[330px] rounded-[24px] overflow-hidden text-left shadow-[0_8px_30px_rgba(93,64,55,0.12)] hover:shadow-[0_14px_40px_rgba(93,64,55,0.18)] transition-all duration-500 hover:-translate-y-1"
  >
    {/* Background Image */}
    <img
      src="/images/Maharashtra-scaled.jpg"
      alt="Explore Maharashtra"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Warm overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#3d2118]/95 via-[#5a2e1d]/75 to-[#9a4600]/35" />

    {/* Content */}
    <div className="relative z-10 min-h-[280px] md:min-h-[330px] p-7 md:p-10 lg:p-12 flex items-center">
      <div className="max-w-2xl">

        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-full bg-[#fff8f6]/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Sparkles
              size={17}
              className="text-[#ffbd91]"
            />
          </span>

          <span className="maha-body text-xs md:text-sm uppercase tracking-[0.18em] font-bold text-[#ffbd91]">
            Personalized For You
          </span>
        </div>

        <h2 className="maha-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1] tracking-[-0.035em] text-white">
          Find places
          <br />
          <span className="text-[#ffb68d]">
            made for you.
          </span>
        </h2>

        <p className="maha-body text-sm md:text-base text-white/80 mt-5 max-w-xl leading-relaxed">
          Tell us what you love, when you're travelling,
          and how you like to explore. We'll find the
          Maharashtra destinations that match you best.
        </p>

        <div className="mt-7 inline-flex items-center gap-3 bg-[#f47920] hover:bg-[#e86b13] text-white px-6 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-[0_8px_20px_rgba(244,121,32,0.25)] transition-all duration-300 group-hover:gap-4">
          Plan My Journey
          <ArrowRight size={18} />
        </div>

      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f47920] via-[#ffb68d] to-transparent" />

  </button>
</section>
  );
};

export default RecommendationCard;