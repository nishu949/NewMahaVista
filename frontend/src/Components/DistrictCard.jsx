const DistrictCard = () => {
  return (
    <div className="absolute top-32 left-20 bg-[#f6f1e7] w-96 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-[#3d3321] mb-3">
        📍 Ranchi District:
      </h2>

      <div className="flex gap-4">
       <img
  src="/images/hundru-falls.jpg"
  className="w-32 h-28 object-cover rounded-lg"
  alt="Hundru Falls"
/>


        <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
          <li>Capital city of Jharkhand</li>
          <li>Famous for Hundru Falls</li>
          <li>Rich Tribal History of Munda and Oraon</li>
        </ul>
      </div>

      <button className="mt-4 bg-[#1e5c45] text-white px-4 py-2 rounded-lg">
        Learn More ›
      </button>
    </div>
  );
};

export default DistrictCard;
