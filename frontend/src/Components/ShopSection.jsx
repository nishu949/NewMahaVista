import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  MapPin,
  ShoppingBag,
  Sparkles,
  ScrollText,
  Heart,
} from "lucide-react";

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
    <section className="w-full py-8 sm:py-10">
      <div className="w-full">
        <div className="overflow-hidden rounded-[24px] border border-[#a47148] bg-[#6b3f1d] shadow-[0_18px_45px_rgba(0,0,0,0.20)]">

          {/* ================= HEADER ================= */}
          <div className="relative border-b border-[#b8875c] bg-gradient-to-r from-[#6b3f1d] via-[#80502d] to-[#a47148] px-6 py-6 sm:px-8 lg:px-10">
            
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#f5e6cc]">
                  <div className="flex h-5 w-8 items-center justify-center rounded-full border border-[#d7b384] bg-[#f5e6cc]/10">
                    <Sparkles className="h-4 w-4 text-[#e8d2aa]" />
                  </div>

                  <span className="tracking-wide">
                    Maharashtra Artisan Collection
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[#fff3e0] sm:text-4xl lg:text-[44px]">
                  Heritage Crafts of Maharashtra
                </h2>

                <div className="mt-4 h-[2px] w-20 bg-[#d7b384]" />

                {/* <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f1d7b5] sm:text-base">
                  Discover traditional treasures inspired by Warli art,
                  Paithani weaving, Kolhapuri craft, handmade décor, and local
                  artisan traditions from across Maharashtra.
                </p> */}
              </div>

              <div className="flex flex-row items-center gap-3 sm:gap-4 lg:flex-col lg:items-end">

                {/* Product count */}
                <div className="flex items-center gap-3 rounded-xl border border-[#d7b384]/60 bg-[#f5e6cc] px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8d2aa] text-[#6b3f1d]">
                    <ScrollText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a5a3a]">
                      Crafted Pieces
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-[#3a2416]">
                      {products.length}
                    </p>
                  </div>
                </div>

                {/* View all */}
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 rounded-xl border border-[#d7b384] bg-[#f5e6cc] px-5 py-3 text-sm font-semibold text-[#3a2416] transition-all duration-300 hover:bg-[#e8d2aa]"
                >
                  View All
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ================= PRODUCTS ================= */}
         <div className="relative bg-[#80502d] px-5 py-6 sm:px-8 lg:px-10">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d7b384] border-t-transparent" />

                <p className="mt-4 text-sm font-medium text-[#f1d7b5]">
                  Loading artisan treasures...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-4xl">😔</div>

                <p className="text-lg font-medium text-red-200">
                  {error}
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-lg bg-[#f5e6cc] px-6 py-2.5 text-sm font-semibold text-[#3a2416] transition hover:bg-[#e8d2aa]"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && featuredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-5xl">🛍️</div>

                <p className="text-lg font-medium text-[#f1d7b5]">
                  No products available yet.
                </p>

                <p className="mt-2 text-sm text-[#d4a373]">
                  Check back soon for new artisan collections!
                </p>
              </div>
            )}

            {/* Products */}
            {!loading && !error && featuredProducts.length > 0 && (
              <Swiper
                 modules={[Pagination, Autoplay]}
               
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
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 18,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 22,
                  },
                  1280: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                className="maharashtra-swiper w-full pb-14"
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide
                    key={product._id || product.id}
                    className="!h-auto"
                  >
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d7b384] bg-[#f5e6cc] shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)]">

                      {/* ================= IMAGE ================= */}
                      <div className="relative overflow-hidden bg-[#e8d2aa]">

                        <img
                          src={product.image || "/images/default.jpg"}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/images/default.jpg";
                          }}
                         className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-45"/>

                        {/* Image overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

                        {/* Craft label */}
                        <div className="absolute left-4 top-4">
                          <span className="rounded-md border border-[#d7b384] bg-[#f5e6cc]/95 px-3 py-1.5 text-[11px] font-semibold text-[#6b3f1d] shadow-sm">
                            Maharashtra Craft
                          </span>
                        </div>

                        {/* Stock */}
                        {product.stock !== undefined && (
                          <div
                            className={`absolute right-4 top-4 rounded-md px-3 py-1.5 text-[11px] font-semibold shadow-sm ${
                              product.stock > 10
                                ? "border border-green-200 bg-green-100/95 text-green-700"
                                : product.stock > 0
                                ? "border border-yellow-200 bg-yellow-100/95 text-yellow-700"
                                : "border border-red-200 bg-red-100/95 text-red-700"
                            }`}
                          >
                            {product.stock > 10
                              ? "In Stock"
                              : product.stock > 0
                              ? `${product.stock} left`
                              : "Sold Out"}
                          </div>
                        )}

                        {/* Wishlist */}
                        <button className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/90 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white">
                          <Heart className="h-4 w-4 text-[#6b3f1d]" />
                        </button>
                      </div>

                      {/* ================= CONTENT ================= */}
                      <div className="flex flex-1 flex-col p-5">

                        {/* Location + category */}
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-1.5 text-sm text-[#6b4a2f]">
                            <MapPin className="h-4 w-4 shrink-0 text-[#8b5e34]" />

                            <span className="truncate font-medium">
                              {product.location ||
                                product.category ||
                                "Maharashtra"}
                            </span>
                          </div>

                          <span className="shrink-0 rounded-md border border-[#dbc9ae] bg-[#eadcc7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7f6549]">
                            Handcrafted
                          </span>
                        </div>

                        {/* Product name */}
                        <h3 className="line-clamp-1 text-xl font-bold text-[#3a2416] transition-colors duration-200 group-hover:text-[#6b3f1d]">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-[#6b4a2f]">
                          {product.description}
                        </p>

                        {/* Category */}
                        {product.category && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-[#96795a]">
                              Category
                            </span>

                            <span className="rounded-md bg-[#e8d2aa]/60 px-2 py-1 text-[11px] font-medium text-[#6b3f1d]">
                              {product.category}
                            </span>
                          </div>
                        )}

                        {/* Price + Explore */}
                        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#dbc9ae] pt-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#96795a]">
                              Price
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#3a2416]">
                              ₹{product.price}
                            </p>
                          </div>

                          <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#6b3f1d] px-4 py-2.5 text-sm font-semibold text-[#f5e6cc] transition-all duration-300 hover:bg-[#573017]"
                          >
                            <ShoppingBag className="h-4 w-4" />
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

      {/* ================= SWIPER STYLING ================= */}
      <style>{`
        .maharashtra-swiper {
          width: 100% !important;
          overflow: visible;
        }

        .maharashtra-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .maharashtra-swiper .swiper-slide {
          height: auto !important;
        }

        /* Navigation */
        .maharashtra-swiper .swiper-button-next,
        .maharashtra-swiper .swiper-button-prev {
          width: 42px;
          height: 42px;
          margin-top: -30px;
          border-radius: 50%;
          background: #f5e6cc;
          color: #6b3f1d;
          border: 1px solid #d7b384;
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.18);
          transition: all 0.25s ease;
        }

        .maharashtra-swiper .swiper-button-next:hover,
        .maharashtra-swiper .swiper-button-prev:hover {
          background: #e8d2aa;
          transform: scale(1.05);
        }

        .maharashtra-swiper .swiper-button-prev {
          left: -7px;
        }

        .maharashtra-swiper .swiper-button-next {
          right: -7px;
        }

        .maharashtra-swiper .swiper-button-next::after,
        .maharashtra-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 700;
        }

        .maharashtra-swiper .swiper-button-disabled {
          opacity: 0.35;
        }

        /* Pagination */
        .maharashtra-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .maharashtra-swiper .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          background: #f5e6cc;
          opacity: 0.45;
          transition: all 0.25s ease;
        }

        .maharashtra-swiper .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 10px;
          background: #f5e6cc;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .maharashtra-swiper .swiper-button-next,
          .maharashtra-swiper .swiper-button-prev {
            width: 36px;
            height: 36px;
          }

          .maharashtra-swiper .swiper-button-prev {
            left: -3px;
          }

          .maharashtra-swiper .swiper-button-next {
            right: -3px;
          }

          .maharashtra-swiper .swiper-button-next::after,
          .maharashtra-swiper .swiper-button-prev::after {
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default ShopSection;