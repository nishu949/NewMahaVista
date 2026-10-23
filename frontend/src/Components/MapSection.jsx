import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import MaharahtraGeo from "../data/maharashtra.json";
import bgTexture from "../assets/images/bg-texture.jpg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // ✅ ADDED

const colors = [
  "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#388E3C", "#2E7D32", "#277a2d", "#43A047",
];

// ✅ NEW: District Names Dictionary
const districtNames = {
  en: {}, // Fallback to English (uses the JSON name directly)
  hi: {
    "Gondia": "गोंदिया", "Bhandara": "भंडारा", "Jalgaon": "जलगांव", "Wardha": "वर्धा",
    "Buldhana": "बुलढाणा", "Akola": "अकोला", "Nashik": "नासिक", "Gadchiroli": "गढ़चिरौली",
    "Washim": "वाशिम", "Chandrapur": "चंद्रपुर", "Yavatmal": "यवतमाल", "Jalna": "जालना",
    "Aurangabad": "औरंगाबाद", "Parbhani": "परभणी", "Hingoli": "हिंगोली", "Nanded": "नांदेड़",
    "Beed": "बीड", "Latur": "लातूर", "Osmanabad": "उस्मानाबाद", "Solapur": "सोलापुर",
    "Pune": "पुणे", "Ahmednagar": "अहमदनगर", "Thane": "ठाणे", "Mumbai": "मुंबई",
    "Raigad": "रायगढ़", "Ratnagiri": "रत्नागिरी", "Sindhudurg": "सिंधुदुर्ग", "Satara": "सतारा",
    "Sangli": "सांगली", "Kolhapur": "कोल्हापुर", "Palghar": "पालघर", "Nandurbar": "नंदुरबार",
    "Dhule": "धुले", "Amravati": "अमरावती", "Nagpur": "नागपुर"
  },
  mr: {
    "Gondia": "गोंदिया", "Bhandara": "भंडारा", "Jalgaon": "जळगाव", "Wardha": "वर्धा",
    "Buldhana": "बुलढाणा", "Akola": "अकोला", "Nashik": "नाशिक", "Gadchiroli": "गडचिरोली",
    "Washim": "वाशिम", "Chandrapur": "चंद्रपूर", "Yavatmal": "यवतमाळ", "Jalna": "जालना",
    "Aurangabad": "औरंगाबाद", "Parbhani": "परभणी", "Hingoli": "हिंगोली", "Nanded": "नांदेड",
    "Beed": "बीड", "Latur": "लातूर", "Osmanabad": "उस्मानाबाद", "Solapur": "सोलापूर",
    "Pune": "पुणे", "Ahmednagar": "अहमदनगर", "Thane": "ठाणे", "Mumbai": "मुंबई",
    "Raigad": "रायगड", "Ratnagiri": "रत्नागिरी", "Sindhudurg": "सिंधुदुर्ग", "Satara": "सातारा",
    "Sangli": "सांगली", "Kolhapur": "कोल्हापूर", "Palghar": "पालघर", "Nandurbar": "नंदुरबार",
    "Dhule": "धुळे", "Amravati": "अमरावती", "Nagpur": "नागपूर"
  }
};

const MapSection = () => {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const { t, lang } = useLanguage(); // ✅ ADDED lang

  // ✅ NEW: Translation Helper
  const getTranslatedName = (name) => {
    if (!name) return "";
    const cleanName = name.trim();
    if (lang === "en") return cleanName;
    // Look up in dictionary, if not found, return original English
    return districtNames[lang]?.[cleanName] || cleanName; 
  };

  return (
    <section className="relative w-full overflow-hidden rounded-[34px] p-4 shadow-[0_20px_60px_rgba(21,61,35,0.25)] md:p-6 min-h-[620px] lg:min-h-[680px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgTexture})` }}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px]" />

      {/* Decorative glow */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-green-300/20 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between rounded-[24px] border border-white/40 bg-white/55 px-5 py-4 shadow-md backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4d7c57]">
              {t("interactiveExplorer")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#1B5E20] md:text-3xl">
              {t("districtExplorer")}
            </h2>
          </div>

          <div className="hidden rounded-full bg-[#1B5E20] px-4 py-2 text-sm font-medium text-white md:block">
            {t("clickDistrict")}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          {/* Left Map Panel */}
          <div className="rounded-[28px] border border-white/40 bg-[#e8f3ec]/45 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md md:p-3">
            <div className="relative h-[580px] overflow-hidden rounded-[24px] md:h-[620px] lg:h-[660px]">
              {/* Texture Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${bgTexture})` }}
              />

              {/* Wheat / parchment overlay */}
              <div className="absolute inset-0 bg-[#f5deb3]/70" />

              {/* Map Content */}
              <div className="relative z-10 h-full">
                <ComposableMap
                  projection="geoMercator"
                  width={1100}
                  height={820}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Geographies geography={MaharahtraGeo}>
                    {({ geographies, projection }) => {
                      projection.fitExtent(
                        [[20, 20], [980, 780]],
                        {
                          type: "FeatureCollection",
                          features: geographies,
                        }
                      );

                      return geographies.map((geo, index) => {
                        if (
                          geo.properties.st_nm &&
                          geo.properties.st_nm !== "Maharashtra"
                        ) {
                          return null;
                        }

                        let districtName =
                          geo.properties.district_name ||
                          geo.properties.NAME_2 ||
                          geo.properties.district ||
                          geo.properties.DISTRICT ||
                          "NA";

                        districtName = districtName.trim();
                        
                        // ✅ NEW: Translate the name for display
                        const displayName = getTranslatedName(districtName);

                        const centroid = geoCentroid(geo);
                        const isHovered = hovered === districtName;
                        const isSelected =
                          selected &&
                          (selected.district_name === districtName ||
                            selected.NAME_2 === districtName ||
                            selected.district === districtName ||
                            selected.DISTRICT === districtName);

                        return (
                          <g key={geo.rsmKey}>
                            <Geography
                              geography={geo}
                              onClick={() => setSelected(geo.properties)}
                              onMouseEnter={() => setHovered(districtName)}
                              onMouseLeave={() => setHovered(null)}
                              style={{
                                default: {
                                  fill: isSelected
                                    ? "#2E7D32"
                                    : colors[index % colors.length],
                                  outline: "none",
                                  transition: "all 0.25s ease",
                                },
                                hover: {
                                  fill: "#66BB6A",
                                  cursor: "pointer",
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#1B5E20",
                                  outline: "none",
                                },
                              }}
                              stroke="#ffffff"
                              strokeWidth={1.5}
                            />

                            <Marker coordinates={centroid}>
                              <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontSize: isHovered || isSelected ? "14px" : "12px",
                                  fontWeight: "800",
                                  fill: isSelected ? "#4d2905" : "#1B1B1B",
                                  pointerEvents: "none",
                                  transition: "all 0.2s ease",
                                  textShadow: "1px 1px 2px rgba(255,255,255,0.9)",
                                }}
                              >
                                {/* ✅ NEW: Use the translated displayName */}
                                {displayName}
                              </text>
                            </Marker>
                          </g>
                        );
                      });
                    }}
                  </Geographies>
                </ComposableMap>
              </div>
            </div>
          </div>

          {/* Right Detail Panel */}
          <div className="min-h-[520px] rounded-[28px] border border-white/40 bg-white/65 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md md:min-h-[560px] lg:min-h-[590px]">
            {selected ? (
              <div className="flex h-full flex-col">
                <div className="relative">
                  <img
                    src={selected.image || "/images/default.jpg"}
                    alt={selected.district_name || "District"}
                    onError={(e) => {
                      e.target.src = "/images/default.jpg";
                    }}
                    className="h-52 w-full rounded-t-[28px] object-cover"
                  />

                  <div className="absolute inset-0 rounded-t-[28px] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {t("maharashtraDistrict")}
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {/* ✅ NEW: Translate the selected panel title too */}
                      {getTranslatedName(
                        selected.district_name ||
                        selected.NAME_2 ||
                        selected.district ||
                        selected.DISTRICT ||
                        "District"
                      )}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-black shadow-md transition hover:bg-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div
                      className="text-sm leading-7 text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html:
                          selected.description ||
                          t("noDescription"),
                      }}
                    />
                  </div>

                  <div className="mt-8 border-t border-[#d8e7d6] pt-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {t("culturalRegion")}
                      </span>
                      <span className="text-sm font-medium text-[#4d7c57]">
                        {t("maharashtra")}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (selected?.wiki) {
                            window.open(selected.wiki, "_blank", "noopener,noreferrer");
                          } else {
                            alert("Wikipedia link not available for this district yet.");
                          }
                        }}
                        className="flex-1 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:from-[#164a19] hover:to-[#256528]"
                      >
                        {t("viewDetails")}
                      </button>

                      <button
                        onClick={() => {
                          const districtName =
                            selected?.district_name ||
                            selected?.NAME_2 ||
                            selected?.district ||
                            selected?.DISTRICT ||
                            "";

                          if (!districtName) return;

                          const slug = districtName.toLowerCase().trim().replace(/\s+/g, "-");
                          navigate(`/city/${slug}`);
                        }}
                        className="flex-1 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:from-[#164a19] hover:to-[#256528]"
                      >
                        {t("planTrip")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[520px] flex-col items-center justify-center px-8 text-center md:min-h-[560px] lg:min-h-[590px]">
                <div className="mb-5 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  {t("selectDistrict")}
                </div>
                <h3 className="text-2xl font-bold text-[#1B5E20]">
                  {t("districtDetailsAppear")}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-gray-600">
                  {t("clickAnyDistrict")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;