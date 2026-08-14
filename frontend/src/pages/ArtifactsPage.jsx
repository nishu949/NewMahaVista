import React, { useEffect, useMemo, useState } from "react";
import products from "../Components/ProductCard";
import {
  MapPin,
  Heart,
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Traditional Warli Painting",
    price: 1499,
    location: "Palghar",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
    description:
      "Hand-painted Warli artwork inspired by tribal stories, village life, and nature motifs.",
  },
  {
    id: 2,
    name: "Kolhapuri Leather Chappals",
    price: 1899,
    location: "Kolhapur",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description:
      "Classic handcrafted footwear with a timeless leather finish and strong local identity.",
  },
  {
    id: 3,
    name: "Paithani Silk Saree",
    price: 12999,
    location: "Yeola",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    description:
      "Elegant silk saree inspired by the rich weaving heritage of Maharashtra.",
  },
  {
    id: 4,
    name: "Sawantwadi Wooden Toy",
    price: 2299,
    location: "Sindhudurg",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    description:
      "Colorful handcrafted wooden toy made in a traditional Sawantwadi style.",
  },
  {
    id: 5,
    name: "Handmade Brass Decor",
    price: 3499,
    location: "Pune",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "Decorative brass piece with a warm handcrafted finish for home interiors.",
  },
  {
    id: 6,
    name: "Artisan Gift Box",
    price: 2799,
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80",
    description:
      "Curated gift set featuring small handcrafted products from regional artisans.",
  },
  {
    id: 7,
    name: "Clay Festival Diya Set",
    price: 899,
    location: "Nashik",
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=80",
    description:
      "Handmade clay diyas created for festive decor and traditional celebrations.",
  },
  {
    id: 8,
    name: "Handwoven Cotton Shawl",
    price: 1599,
    location: "Nagpur",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft handwoven shawl with a simple artisan finish for everyday use.",
  },
  {
    id: 9,
    name: "Maharashtrian Copper Pot",
    price: 2499,
    location: "Aurangabad",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85?auto=format&fit=crop&w=900&q=80",
    description:
      "Traditional copper vessel suited for decor, gifting, and heritage kitchens.",
  },
  {
    id: 10,
    name: "Bamboo Utility Basket",
    price: 1199,
    location: "Gadchiroli",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    description:
      "A woven bamboo basket crafted for storage, decor, and daily household use.",
  },
  {
    id: 11,
    name: "Handcrafted Terracotta Vase",
    price: 1799,
    location: "Solapur",
    image:
      "https://images.unsplash.com/photo-1612196808214-b7e239e5ec16?auto=format&fit=crop&w=900&q=80",
    description:
      "Earthy terracotta vase shaped by hand with a minimal rustic character.",
  },
  {
    id: 12,
    name: "Leather Journal Cover",
    price: 1399,
    location: "Satara",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    description:
      "Artisan-made leather journal cover with a vintage handcrafted appearance.",
  },
  {
    id: 13,
    name: "Traditional Nose Pin Box",
    price: 999,
    location: "Nanded",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    description:
      "Small decorative box inspired by local ornament traditions and gift craft.",
  },
  {
    id: 14,
    name: "Hand Block Printed Dupatta",
    price: 1699,
    location: "Jalgaon",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    description:
      "Elegant dupatta featuring handcrafted prints with a light and graceful feel.",
  },
  {
    id: 15,
    name: "Wooden Spice Box",
    price: 1899,
    location: "Ratnagiri",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    description:
      "A handcrafted wooden masala box made for traditional kitchens and gifting.",
  },
  {
    id: 16,
    name: "Lambani Style Necklace",
    price: 2199,
    location: "Latur",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80",
    description:
      "Statement jewelry piece with handmade detailing and a folk-inspired aesthetic.",
  },
  {
    id: 17,
    name: "Handpainted Clay Plate",
    price: 1299,
    location: "Ahmednagar",
    image:
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80",
    description:
      "Decorative clay plate with hand-painted patterns for shelves and wall styling.",
  },
  {
    id: 18,
    name: "Festive Toran Decor",
    price: 899,
    location: "Thane",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80",
    description:
      "Traditional toran handcrafted for festive entrances and home decoration.",
  },
  {
    id: 19,
    name: "Handcrafted Bead Pouch",
    price: 1099,
    location: "Amravati",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description:
      "A compact pouch finished with handmade beadwork and artisan detailing.",
  },
  {
    id: 20,
    name: "Miniature Fort Sculpture",
    price: 2599,
    location: "Raigad",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80",
    description:
      "Decor sculpture inspired by historic forts and Maharashtra's cultural legacy.",
  },
  {
    id: 21,
    name: "Handloom Table Runner",
    price: 1499,
    location: "Buldhana",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    description:
      "Simple handloom runner designed to add a subtle craft touch to dining spaces.",
  },
  {
    id: 22,
    name: "Traditional Puppet Pair",
    price: 1899,
    location: "Beed",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    description:
      "Decorative puppet pair made in a playful folk-art style for collectors and gifting.",
  },
  {
    id: 23,
    name: "Handmade Cane Lamp Shade",
    price: 3299,
    location: "Chandrapur",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
    description:
      "A cane lamp shade with a soft handcrafted texture and warm ambient appeal.",
  },
  {
    id: 24,
    name: "Embroidered Potli Bag",
    price: 1399,
    location: "Osmanabad",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    description:
      "Traditional potli bag featuring embroidery details for festive and casual styling.",
  },
  {
    id: 25,
    name: "Wood Carved Wall Panel",
    price: 3999,
    location: "Sangli",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    description:
      "A decorative carved wall panel made to bring a handcrafted touch to interiors.",
  },
  {
    id: 26,
    name: "Handmade Jute Floor Mat",
    price: 1799,
    location: "Akola",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "Woven jute mat with a natural texture suited for entryways and cozy corners.",
  },
  {
    id: 27,
    name: "Tribal Pattern Cushion Cover",
    price: 999,
    location: "Yavatmal",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    description:
      "Cushion cover featuring tribal-inspired patterns and earthy handcrafted styling.",
  },
  {
    id: 28,
    name: "Palm Leaf Storage Box",
    price: 1299,
    location: "Wardha",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight storage box woven by hand using natural leaf-based craft methods.",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getCartQuantity = (cart, productId) => {
  const item = cart.find((cartItem) => cartItem.id === productId);
  return item ? item.quantity : 0;
};

const getCartTotal = (cart) =>
  cart.reduce((total, item) => total + item.price * item.quantity, 0);

const getCartItemsCount = (cart) =>
  cart.reduce((total, item) => total + item.quantity, 0);

export default function ArtifactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  const filteredProducts = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.location.toLowerCase().includes(value) ||
        product.description.toLowerCase().includes(value)
    );
  }, [searchTerm]);

  const addToCart = (product) => {
    setMessage(`${product.name} added to cart`);

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    setMessage("Item removed from cart");
  };

  const toggleLike = (id) => {
    setLikedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-stone-900">
      {message && (
        <div className="fixed right-5 top-5 z-50 rounded-full bg-stone-900 px-5 py-3 text-sm text-white shadow-lg">
          {message}
        </div>
      )}

      <header className="border-b border-stone-200 bg-[#f7f3ee]">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
                Maharashtra Marketplace
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-5xl">
                Handcrafted products from across Maharashtra
              </h1>
              <p className="mt-4 text-base leading-8 text-stone-600">
                Explore regional crafts, artisan goods, traditional decor,
                textiles, and handmade accessories from different parts of
                Maharashtra.
              </p>
            </div>

            <div className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700">
              Cart Items:{" "}
              <span className="font-semibold text-stone-900">
                {getCartItemsCount(cart)}
              </span>
            </div>
          </div>

          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product, location, or description"
              className="w-full rounded-full border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition focus:border-stone-500"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-stone-600">
                Showing{" "}
                <span className="font-semibold text-stone-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const isLiked = likedItems.includes(product.id);
                const quantity = getCartQuantity(cart, product.id);

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-sm"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-64 w-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label={
                          isLiked ? "Remove from wishlist" : "Add to wishlist"
                        }
                        onClick={() => toggleLike(product.id)}
                        className={`absolute right-4 top-4 rounded-full p-2 transition ${
                          isLiked
                            ? "bg-stone-900 text-white"
                            : "bg-white/90 text-stone-700"
                        }`}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <MapPin className="h-4 w-4" />
                        <span>{product.location}</span>
                      </div>

                      <h2 className="mt-3 text-lg font-semibold text-stone-900">
                        {product.name}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-base font-semibold text-stone-900">
                          {formatPrice(product.price)}
                        </p>

                        <button
                          type="button"
                          aria-label={`Add ${product.name} to cart`}
                          onClick={() => addToCart(product)}
                          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {quantity > 0 ? `Added (${quantity})` : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-600">
                No products found for your search.
              </div>
            )}
          </section>

          <aside className="h-fit rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-lg font-semibold text-stone-900">
                Your Cart
              </h2>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
                {getCartItemsCount(cart)} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-10 text-center text-sm text-stone-500">
                Your cart is empty. Add a product to see it here.
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-stone-200 p-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold text-stone-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-stone-500">
                          {item.location}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-stone-300">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-3 py-2 text-stone-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-8 text-center text-sm font-medium text-stone-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => increaseQuantity(item.id)}
                          className="px-3 py-2 text-stone-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full bg-stone-100 p-2 text-stone-600 transition hover:bg-stone-900 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-stone-100 pt-4">
                  <div className="flex items-center justify-between text-sm text-stone-600">
                    <span>Total</span>
                    <span className="text-lg font-semibold text-stone-900">
                      {formatPrice(getCartTotal(cart))}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={cart.length === 0}
                    className="mt-4 w-full rounded-full bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}