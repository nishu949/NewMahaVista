import React from "react";

const FestivalCard = ({ month, color, festivals }) => {
  return (
    <div
      className={`rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition duration-300 ${color}`}
    >
      <div className="bg-white py-3">
        <h2 className="text-3xl font-bold text-center text-purple-800">
          {month}
        </h2>
      </div>

      <div className="bg-white p-5">
        {festivals.map((festival, index) => (
          <div key={index} className="mb-4 border-b pb-3 last:border-none">
            <h3 className="font-semibold text-lg">
              🪔 {festival.name}
            </h3>

            <p className="text-gray-600">
              📅 {festival.date}
            </p>

            <button className="mt-3 w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestivalCard;