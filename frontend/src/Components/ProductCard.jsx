const ProductCard = ({ product }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:scale-105 hover:shadow-xl">
      <img
        src={product.image}
        alt={product.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-4">
        <p className="text-sm text-stone-500">{product.location || product.category}</p>

        <h4 className="mt-1 text-lg font-semibold text-[#3d3321]">
          {product.name}
        </h4>

        <p className="mt-2 line-clamp-2 text-sm text-stone-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-bold text-[#c27b2f]">₹{product.price}</p>

          <button className="rounded-full bg-[#3d3321] px-4 py-2 text-sm text-white transition hover:bg-[#f0a942] hover:text-[#3d3321]">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;