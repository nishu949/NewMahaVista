import React from "react";

const upcomingFestivals = [
  { date: "14 Jan", name: "Makar Sankranti" },
  { date: "17 Feb", name: "Maha Shivratri" },
  { date: "01 Apr", name: "Gudi Padwa" },
  { date: "26 Aug", name: "Ganesh Chaturthi" },
  { date: "22 Oct", name: "Navratri" },
  { date: "30 Oct", name: "Dussehra" },
  { date: "12 Nov", name: "Diwali" },
];

const UpcomingFestivals = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
      <div className="bg-purple-700 text-white text-center py-4">
        <h2 className="text-2xl font-bold">
          📅 Upcoming Festivals
        </h2>
      </div>

      <div className="p-5">
        {upcomingFestivals.map((festival, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-3"
          >
            <div className="bg-purple-100 text-purple-800 font-bold rounded-lg px-3 py-2">
              {festival.date}
            </div>

            <div className="ml-4 flex-1">
              <h3 className="font-semibold">{festival.name}</h3>
            </div>
          </div>
        ))}

        <button className="mt-6 w-full bg-purple-700 text-white py-3 rounded-xl hover:bg-purple-800">
          View Full Calendar
        </button>
      </div>
    </div>
  );
};

export default UpcomingFestivals;