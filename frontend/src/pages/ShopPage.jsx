import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, ShoppingBag } from "lucide-react";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return products;

    return products.filter((product) =>
      `${product.name} ${product.description} ${product.location || ""} ${product.category || ""}`
        .toLowerCase()
        .includes(value)
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f6ede2] w-full">
      
      <section className="border-b border-[#d8b98d] bg-gradient-to-r from-[#6f3f25] via-[#8b4f2c] to-[#b06b35] text-white w-full">
        <div className="w-full px-6 py-16">
          <p className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            Maharashtra Marketplace
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Explore All Handcrafted Products
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
            Browse artisan collections from across Maharashtra including paintings,
            textiles, decor, folk crafts, and heritage-inspired handmade pieces.
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b5e34]" />
            <input
              type="text"
              placeholder="Search products, category, or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-[#e7cba5] bg-white py-4 pl-12 pr-5 text-sm text-[#4b2e1b] outline-none"
            />
          </div>
        </div>
      </section>
      <section className="w-full px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#4b2e1b]">
            All Products
          </h2>

          <p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#7a3e1f] shadow-sm">
            {filteredProducts.length} items
          </p>
        </div>

        {loading && (
          <p className="text-center text-lg font-medium text-[#6f5743]">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-center text-lg font-medium text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-[#6f5743]">
              No products found.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="group overflow-hidden rounded-[28px] border border-[#e2c79d] bg-[#fffdf9] shadow-[0_12px_28px_rgba(93,52,27,0.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(93,52,27,0.18)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/images/default.jpg";
                    }}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-[#7a3e1f]/90 px-3 py-1 text-xs font-semibold text-[#fff4e4] shadow-md">
                    Maharashtra Craft
                  </div>
                </div>

                <div className="flex flex-col p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#8b5e34]">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location || product.category || "Maharashtra"}</span>
                  </div>

                  <h3 className="line-clamp-1 text-xl font-bold text-[#4b2e1b]">
                    {product.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f5743]">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#ecd8b8] pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#aa7a49]">
                        Price
                      </p>
                      <p className="mt-1 text-2xl font-bold text-[#7a3e1f]">
                        ₹{product.price}
                      </p>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7a3e1f] to-[#b86b2d] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:from-[#5f2e16] hover:to-[#9f571f]">
                      <ShoppingBag className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopPage;