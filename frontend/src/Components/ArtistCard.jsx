const ArtistCard = ({ img, title, subtitle }) => {
  return (
    <div className="group bg-gradient-to-br from-[#3d3321] to-[#2a2418] rounded-xl overflow-hidden text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
  
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold tracking-wide">{title}</h3>
        <p className="text-sm text-[#d2b48c] mt-1">{subtitle}</p>

        
        <button className="mt-3 text-sm bg-gradient-to-r from-[#f5e1c0] to-[#e6d3b3] text-black px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-[#ffe9c9] hover:to-[#f0d9b9] transition-all duration-300">
          Live Now
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
