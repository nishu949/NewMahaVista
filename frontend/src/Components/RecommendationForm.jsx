// import React, { useState, useEffect } from 'react';
// import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

// const RecommendationForm = ({ onSubmit, loading }) => {
//   const [step, setStep] = useState(1);
//   const [preferences, setPreferences] = useState({
//     month: '',
//     interests: [],
//     travel_with: '',
//     budget: '',
//     duration: '',
//     weather_preference: '',
//     starting_city: '',
//     adventure_level: '',
//     avoid: []
//   });
  
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [availableCategories, setAvailableCategories] = useState([]);
  
//   const totalSteps = 7;
  
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
  
//   const interestOptions = [
//     'Nature', 'Heritage', 'Culture', 'Festivals', 'Food', 'Wildlife',
//     'Beaches', 'Hill Stations', 'Adventure', 'Spiritual', 'Photography',
//     'Family', 'Shopping'
//   ];
  
//   const travelOptions = ['Solo', 'Couple', 'Family', 'Friends', 'Students'];
//   const budgetOptions = ['Budget', 'Moderate', 'Premium', 'Luxury'];
//   const durationOptions = ['1 Day', '2-3 Days', '4-5 Days', '6-7 Days', '7+ Days'];
//   const weatherOptions = ['Cold', 'Pleasant', 'Rainy', 'Warm', 'No Preference'];
//   const startingCities = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Kolhapur', 'Other'];
//   const adventureOptions = ['Relaxed', 'Moderate', 'Adventurous', 'Extreme'];
  
//   const avoidOptions = [
//     'Crowded places', 'Long trekking', 'Hot weather',
//     'Heavy rain', 'Difficult activities'
//   ];
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [monthsRes, categoriesRes] = await Promise.all([
//           fetch('http://127.0.0.1:8000/api/destinations/months'),
//           fetch('http://127.0.0.1:8000/api/destinations/categories')
//         ]);
        
//         if (monthsRes.ok) {
//           const data = await monthsRes.json();
//           setAvailableMonths(data.months || monthNames);
//         } else {
//           setAvailableMonths(monthNames);
//         }
        
//         if (categoriesRes.ok) {
//           const data = await categoriesRes.json();
//           setAvailableCategories(data.categories || interestOptions);
//         } else {
//           setAvailableCategories(interestOptions);
//         }
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//         setAvailableMonths(monthNames);
//         setAvailableCategories(interestOptions);
//       }
//     };
    
//     fetchData();
//   }, []);
  
//   const updatePreferences = (key, value) => {
//     setPreferences(prev => ({ ...prev, [key]: value }));
//   };
  
//   const toggleInterest = (interest) => {
//     setPreferences(prev => {
//       const current = prev.interests;
//       if (current.includes(interest)) {
//         return { ...prev, interests: current.filter(i => i !== interest) };
//       } else {
//         return { ...prev, interests: [...current, interest] };
//       }
//     });
//   };
  
//   const toggleAvoid = (item) => {
//     setPreferences(prev => {
//       const current = prev.avoid;
//       if (current.includes(item)) {
//         return { ...prev, avoid: current.filter(i => i !== item) };
//       } else {
//         return { ...prev, avoid: [...current, item] };
//       }
//     });
//   };
  
//   const handleSubmit = () => {
//     if (!preferences.month) {
//       alert('Please select a month first');
//       return;
//     }
//     onSubmit(preferences);
//   };
  
//   const nextStep = () => {
//     if (step < totalSteps) setStep(step + 1);
//   };
  
//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };
  
//   const renderStep = () => {
//     switch(step) {
//       case 1:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               When do you want to visit?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Select the month you're planning to travel
//             </p>
//             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4">
//               {availableMonths.map((month) => (
//                 <button
//                   key={month}
//                   onClick={() => updatePreferences('month', month)}
//                   className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.month === month
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {month.slice(0, 3)}
//                 </button>
//               ))}
//             </div>
//             {preferences.month && (
//               <p className="mt-3 font-body text-sm font-semibold text-[#C1502D]">
//                 Selected: {preferences.month} ✦
//               </p>
//             )}
//           </div>
//         );
        
//       case 2:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               What experiences do you enjoy?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Select all that interest you
//             </p>
//             <div className="flex flex-wrap gap-2 mt-4">
//               {availableCategories.map((interest) => (
//                 <button
//                   key={interest}
//                   onClick={() => toggleInterest(interest)}
//                   className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.interests.includes(interest)
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {interest}
//                 </button>
//               ))}
//             </div>
//             {preferences.interests.length > 0 && (
//               <p className="mt-3 font-body text-[10px] text-[#8A5A3E]">
//                 Selected ({preferences.interests.length}): {preferences.interests.join(', ')}
//               </p>
//             )}
//           </div>
//         );
        
//       case 3:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               Who are you travelling with?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Select your travel companion
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
//               {travelOptions.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => updatePreferences('travel_with', option)}
//                   className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.travel_with === option
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>
//         );
        
//       case 4:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               What's your budget?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Select your preferred budget range
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
//               {budgetOptions.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => updatePreferences('budget', option)}
//                   className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.budget === option
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>
//         );
        
//       case 5:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               How many days do you have?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Select your trip duration
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
//               {durationOptions.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => updatePreferences('duration', option)}
//                   className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.duration === option
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>
//         );
        
//       case 6:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               What's your starting point?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Where are you starting your journey?
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
//               {startingCities.map((city) => (
//                 <button
//                   key={city}
//                   onClick={() => updatePreferences('starting_city', city)}
//                   className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.starting_city === city
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {city}
//                 </button>
//               ))}
//             </div>
//           </div>
//         );
        
//       case 7:
//         return (
//           <div>
//             <h3 className="font-display text-lg md:text-xl font-bold text-[#20263F]">
//               How adventurous are you?
//             </h3>
//             <p className="font-body text-xs text-[#8A5A3E] mt-1">
//               Select your adventure level
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
//               {adventureOptions.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => updatePreferences('adventure_level', option)}
//                   className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-200 ${
//                     preferences.adventure_level === option
//                       ? 'bg-[#C1502D] text-white shadow-md'
//                       : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                   }`}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
            
//             <div className="mt-5 pt-4 border-t border-[#E9DAC3]">
//               <p className="font-body text-xs font-medium text-[#5A3A25] mb-2">
//                 Anything you'd like to avoid?
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {avoidOptions.map((item) => (
//                   <button
//                     key={item}
//                     onClick={() => toggleAvoid(item)}
//                     className={`px-2.5 py-1 rounded-full font-body text-[10px] transition-all duration-200 ${
//                       preferences.avoid.includes(item)
//                         ? 'bg-red-100 border border-red-300 text-red-700'
//                         : 'bg-white border border-[#E9DAC3] text-[#5A3A25] hover:bg-[#FBF4E8]'
//                     }`}
//                   >
//                     {item}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );
        
//       default:
//         return null;
//     }
//   };
  
//   return (
//     <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E9DAC3] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      
//       {/* Progress */}
//       <div className="flex items-center gap-3 mb-5">
//         <span className="font-body text-xs font-bold text-[#5A3A25]">Step {step}/{totalSteps}</span>
//         <div className="flex-1 h-1.5 bg-[#FBF4E8] rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-[#C1502D] to-[#E9A23B] rounded-full transition-all duration-500"
//             style={{ width: `${(step / totalSteps) * 100}%` }}
//           />
//         </div>
//       </div>
      
//       {/* Step Content */}
//       {renderStep()}
      
//       {/* Navigation */}
//       <div className="flex justify-between mt-6 pt-5 border-t border-[#E9DAC3]">
//         <button
//           onClick={prevStep}
//           disabled={step === 1}
//           className={`px-5 py-2 rounded-full font-body text-xs font-semibold transition-all duration-200 ${
//             step === 1
//               ? 'text-[#D9C6A3] cursor-not-allowed'
//               : 'bg-[#FBF4E8] text-[#5A3A25] hover:bg-[#F3E5CC]'
//           }`}
//         >
//           ← Back
//         </button>
        
//         {step === totalSteps ? (
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-6 py-2 rounded-full bg-gradient-to-r from-[#C1502D] to-[#A8431F] text-white font-body text-xs font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Finding...
//               </>
//             ) : (
//               <>
//                 Get Recommendations ✦
//               </>
//             )}
//           </button>
//         ) : (
//           <button
//             onClick={nextStep}
//             className="px-6 py-2 rounded-full bg-[#C1502D] text-white font-body text-xs font-semibold hover:bg-[#A8431F] transition-all duration-200"
//           >
//             Next →
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecommendationForm;