import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { MapPin, ShoppingBag, Sparkles, ScrollText, Star, Heart } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <section className="w-full py-16">
      <div className="w-full">
        <div className="overflow-hidden rounded-[32px] border border-[#a47148] bg-gradient-to-br from-[#6b3f1d] via-[#a47148] to-[#d4a373] shadow-[0_24px_55px_rgba(0,0,0,0.3)]">
          <div className="relative border-b border-[#b8875c] px-6 py-10 md:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.15),transparent_40%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d7b384] bg-[#f5e6cc]/90 px-4 py-2 text-sm font-medium text-[#3a2416] shadow-sm">
                  <Sparkles className="h-4 w-4 text-[#a47148]" />
                  Maharashtra Artisan Collection
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[#fff3e0] sm:text-4xl lg:text-5xl">
                  Heritage Crafts of Maharashtra
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f1d7b5] sm:text-base">
                  Discover traditional treasures inspired by Warli art,
                  Paithani weaving, Kolhapuri craft, handmade décor, and local
                  artisan traditions from across Maharashtra.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:items-end">
                <div className="flex w-fit items-center gap-4 rounded-2xl border border-[#d7b384] bg-[#f5e6cc]/90 px-5 py-4 backdrop-blur-sm">
                  <div className="rounded-xl bg-[#e8d2aa] p-3 text-[#6b3f1d]">
                    <ScrollText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#7a5a3a]">
                      Crafted Pieces
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#3a2416]">
                      {products.length}
                    </p>
                  </div>
                </div>

                <Link
                  to="/shop"
                  className="group relative overflow-hidden rounded-full border border-[#d7b384] bg-[#f5e6cc] px-6 py-2.5 font-semibold text-[#3a2416] transition-all duration-300 hover:scale-105 hover:bg-[#e8d2aa] hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View All
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#d7b384]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative px-5 py-10 sm:px-8 lg:px-10">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#d7b384] border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-[#d7b384]">⏳</span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-[#f1d7b5]">
                  Loading artisan treasures...
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">😔</div>
                <p className="text-lg font-medium text-red-200">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 rounded-full bg-[#f5e6cc] text-[#3a2416] font-medium hover:bg-[#e8d2aa] transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && featuredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🛍️</div>
                <p className="text-lg font-medium text-[#f1d7b5]">
                  No products available yet.
                </p>
                <p className="text-sm text-[#d4a373] mt-2">
                  Check back soon for new artisan collections!
                </p>
              </div>
            )}

            {!loading && !error && featuredProducts.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={featuredProducts.length > 4}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 18 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 22 },
                  1280: { slidesPerView: 4, spaceBetween: 24 },
                }}
                className="maharashtra-swiper w-full pb-14"
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product._id || product.id} className="!h-auto">
                    <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#d7b384] bg-[#f5e6cc] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all duration-400 hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/images/default.jpg"}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/images/default.jpg";
                          }}
                          className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute left-4 top-4 rounded-full border border-[#d7b384] bg-[#f5e6cc]/95 px-3 py-1.5 text-xs font-semibold text-[#6b3f1d] shadow-sm backdrop-blur-sm">
                          Maharashtra Craft
                        </div>

                        {product.stock !== undefined && (
                          <div className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm ${
                            product.stock > 10 
                              ? 'bg-green-100/90 text-green-700 border border-green-200' 
                              : product.stock > 0 
                              ? 'bg-yellow-100/90 text-yellow-700 border border-yellow-200'
                              : 'bg-red-100/90 text-red-700 border border-red-200'
                          }`}>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Sold Out'}
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#3f3428]/60 via-[#3f3428]/20 to-transparent" />
                        
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="rounded-full bg-white/90 p-2.5 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                            <Heart className="h-4 w-4 text-[#6b3f1d]" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm text-[#6b4a2f]">
                            <MapPin className="h-4 w-4 text-[#8b5e34]" />
                            <span className="font-medium">
                              {product.location || product.category || "Maharashtra"}
                            </span>
                          </div>

                          <span className="rounded-full bg-[#eadcc7] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7f6549] border border-[#dbc9ae]">
                            Handcrafted
                          </span>
                        </div>

                        <h3 className="line-clamp-1 text-xl font-bold text-[#3a2416] group-hover:text-[#6b3f1d] transition-colors duration-300">
                          {product.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6b4a2f] group-hover:text-[#5a3d29] transition-colors duration-300">
                          {product.description}
                        </p>

                        {product.category && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-[#96795a]">Category:</span>
                            <span className="text-xs font-medium text-[#6b3f1d] bg-[#e8d2aa]/50 px-2 py-0.5 rounded-full">
                              {product.category}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#dbc9ae] pt-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#96795a]">
                              Price
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[#3a2416]">
                              ₹{product.price}
                            </p>
                          </div>

                          <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 rounded-full border border-[#d7b384] bg-[#e8d2aa] px-5 py-2.5 text-sm font-semibold text-[#3a2416] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#dcbf92] hover:shadow-lg group/link"
                          >
                            <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover/link:scale-110" />
                            Explore
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .maharashtra-swiper {
          width: 100% !important;
        }

        .maharashtra-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .maharashtra-swiper .swiper-slide {
          height: auto !important;
        }

        .maharashtra-swiper .swiper-button-next,
        .maharashtra-swiper .swiper-button-prev {
          width: 50px;
          height: 50px;
          border-radius: 9999px;
          background: rgba(107, 63, 29, 0.9);
          color: #f5e6cc;
          border: 2px solid rgba(215, 179, 132, 0.3);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .maharashtra-swiper .swiper-button-next:hover,
        .maharashtra-swiper .swiper-button-prev:hover {
          transform: scale(1.1);
          background: rgba(107, 63, 29, 1);
          border-color: rgba(215, 179, 132, 0.6);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        }

        .maharashtra-swiper .swiper-button-prev {
          left: -10px;
        }

        .maharashtra-swiper .swiper-button-next {
          right: -10px;
        }

        .maharashtra-swiper .swiper-button-next::after,
        .maharashtra-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: 900;
        }

        .maharashtra-swiper .swiper-button-disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .maharashtra-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .maharashtra-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #f5e6cc;
          opacity: 0.5;
          transition: all 0.4s ease;
          border: 1px solid rgba(215, 179, 132, 0.3);
        }

        .maharashtra-swiper .swiper-pagination-bullet:hover {
          opacity: 0.8;
          transform: scale(1.2);
        }

        .maharashtra-swiper .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 9999px;
          background: #f5e6cc;
          opacity: 1;
          border-color: #d7b384;
        }

        .maharashtra-swiper .swiper-pagination-bullet-active:hover {
          transform: none;
        }

        @media (max-width: 768px) {
          .maharashtra-swiper .swiper-button-next,
          .maharashtra-swiper .swiper-button-prev {
            width: 40px;
            height: 40px;
          }
          
          .maharashtra-swiper .swiper-button-prev {
            left: -5px;
          }
          
          .maharashtra-swiper .swiper-button-next {
            right: -5px;
          }
          
          .maharashtra-swiper .swiper-button-next::after,
          .maharashtra-swiper .swiper-button-prev::after {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
};

export default ShopSection;