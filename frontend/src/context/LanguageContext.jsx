import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

// Add all your component words here
const dictionary = {
  en: {
    // Navbar
    exploreMap: "Explore Map", calendar: "Calendar", bazaar: "Bazaar", kids: "Kids Corner", recommendation: "Recommendation", bookings: "Your Bookings", login: "Login", logout: "Logout", hi: "Hi",
    // Calendar
    searchFestival: "Search festival...", upcoming: "Upcoming Festivals", viewFull: "View Full Calendar", reminder: "Festival Reminder", noFestivals: "No upcoming festivals.",
    // Kids
    kidsCorner: "Kids Corner", kidsSub: "Stories and quizzes from the heart of Maharashtra", watchStory: "Watch story", viewAll: "View all stories", cultureQuiz: "Culture quiz", startQuiz: "Start Quiz", beginJourney: "Begin your journey",
    // Shop
    heritageCrafts: "Heritage Crafts of Maharashtra", craftedPieces: "Crafted Pieces", viewAllProducts: "View All", explore: "Explore", handmade: "Handcrafted",
    // Map
    interactiveExplorer: "Interactive Explorer",
    districtExplorer: "Maharashtra District Explorer", 
    clickDistrict: "Click a district", 
    maharashtraDistrict: "Maharashtra District",
    culturalRegion: "Cultural Region",
    maharashtra: "Maharashtra",
    viewDetails: "View Details →", 
    planTrip: "Plan Trip", 
    selectDistrict: "Select a district",
    districtDetailsAppear: "District details will appear here",
    clickAnyDistrict: "Click any district on the map to view its image, description, and district-specific information in this panel.",
    noDescription: "No description available for this district.",
    // Recommendation (✅ NEW KEYS ADDED)
    personalizedForYou: "Personalized For You",
    findPlacesLine1: "Find places",
    findPlacesLine2: "made for you.",
    recommendationDesc: "Tell us what you love, when you're travelling, and how you like to explore. We'll find the Maharashtra destinations that match you best.",
    planJourney: "Plan My Journey",

    //bottom slider
    forts: "Forts",
warliArt: "Warli Art",
lavani: "Lavani",
heritage: "Heritage",
traditions: "Traditions",
    // Mystery (✅ NEW KEYS ADDED)
    mysteryTitle: "Maharashtra Mystery", 
    playMystery: "Play Mystery",
    interactiveGame: "Interactive Game",
    mysteryDesc: "Can you guess the hidden secret of Maharashtra? Use clues wisely and become a top explorer!",
    xpPoints: "500+ XP",
    clues: "3 Clues",
    nextCharacter: "THE NEXT CHARACTER!",
    legendText: "Be the legend. Inspire explorers!",
    // BottomSlider (✅ NEW KEYS ADDED)
    mysticTrail: "Mystic Trail Quiz",
    cultureQuizTitle: "Culture Quiz",
    discoverHeritage: "Discover Maharashtra's Heritage",
    cultureQuizDesc: "Test your knowledge of Maharashtra's magnificent forts, vibrant culture, rich culinary traditions, and centuries-old heritage through an engaging interactive quiz experience.",
    history: "History",
    mightyForts: "Mighty Forts",
    culture: "Culture",
    livingArts: "Living Arts",
    cuisine: "Cuisine",
    flavorSpice: "Flavor & Spice",
    played: "1.2k+ played",
    earnPoints: "Earn points",
    quizTime: "Quiz Time",
  },
  hi: {
    // Navbar
    exploreMap: "नक्शा देखें", calendar: "कैलेंडर", bazaar: "बाज़ार", kids: "बच्चों का कोना", recommendation: "सुझाव", bookings: "आपकी बुकिंग", login: "लॉगिन", logout: "लॉगआउट", hi: "नमस्ते",
    // Calendar
    searchFestival: "त्योहार खोजें...", upcoming: "आने वाले त्योहार", viewFull: "पूरा कैलेंडर देखें", reminder: "त्योहार अनुस्मारक", noFestivals: "कोई आने वाला त्योहार नहीं है।",
    // Kids
    kidsCorner: "बच्चों का कोना", kidsSub: "महाराष्ट्र के दिल से कहानियाँ और प्रश्नोत्तरी", watchStory: "कहानी देखें", viewAll: "सभी कहानियाँ देखें", cultureQuiz: "संस्कृति प्रश्नोत्तरी", startQuiz: "प्रश्नोत्तरी शुरू करें", beginJourney: "अपनी यात्रा शुरू करें",
    // Shop
    heritageCrafts: "महाराष्ट्र की विरासत शिल्प", craftedPieces: "निर्मित वस्तुएं", viewAllProducts: "सभी देखें", explore: "खोजें", handmade: "हस्तनिर्मित",
    // Map
    interactiveExplorer: "इंटरैक्टिव खोजकर्ता",
    districtExplorer: "महाराष्ट्र जिला खोजकर्ता", 
    clickDistrict: "जिला चुनें", 
    maharashtraDistrict: "महाराष्ट्र जिला",
    culturalRegion: "सांस्कृतिक क्षेत्र",
    maharashtra: "महाराष्ट्र",
    viewDetails: "विवरण देखें →", 
    planTrip: "यात्रा की योजना बनाएं", 
    selectDistrict: "जिला चुनें",
    districtDetailsAppear: "जिले का विवरण यहाँ दिखाई देगा",
    clickAnyDistrict: "इस पैनल में जिले की छवि, विवरण और जिला-विशिष्ट जानकारी देखने के लिए मानचित्र पर किसी भी जिले पर क्लिक करें।",
    noDescription: "इस जिले के लिए कोई विवरण उपलब्ध नहीं है।",
    // Recommendation (✅ NEW KEYS ADDED)
    personalizedForYou: "आपके लिए व्यक्तिगत",
    findPlacesLine1: "जगहें खोजें",
    findPlacesLine2: "आपके लिए बनाई गई।",
    recommendationDesc: "हमें बताएं कि आपको क्या पसंद है, आप कब यात्रा कर रहे हैं, और आप कैसे घूमना पसंद करते हैं। हम आपके लिए सबसे अच्छे महाराष्ट्र के गंतव्य खोजेंगे।",
    planJourney: "मेरी यात्रा की योजना बनाएं",
    //bottom slider
    forts: "किले",
warliArt: "वारली कला",
lavani: "लावणी",
heritage: "विरासत",
traditions: "परंपराएं",
    // Mystery (✅ NEW KEYS ADDED)
    mysteryTitle: "महाराष्ट्र रहस्य", 
    playMystery: "रहस्य खेलें",
    interactiveGame: "इंटरैक्टिव गेम",
    mysteryDesc: "क्या आप महाराष्ट्र का छिपा हुआ रहस्य जान सकते हैं? संकेतों का समझदारी से उपयोग करें और शीर्ष खोजकर्ता बनें!",
    xpPoints: "500+ XP",
    clues: "3 संकेत",
    nextCharacter: "अगला किरदार!",
    legendText: "किंवदंती बनें। खोजकर्ताओं को प्रेरित करें!",
    // BottomSlider (✅ NEW KEYS ADDED)
    mysticTrail: "मिस्टिक ट्रेल क्विज़",
    cultureQuizTitle: "संस्कृति प्रश्नोत्तरी",
    discoverHeritage: "महाराष्ट्र की विरासत खोजें",
    cultureQuizDesc: "एक आकर्षक इंटरैक्टिव क्विज़ अनुभव के माध्यम से महाराष्ट्र के शानदार किलों, जीवंत संस्कृति, समृद्ध पाक परंपराओं और सदियों पुरानी विरासत के बारे में अपने ज्ञान का परीक्षण करें।",
    history: "इतिहास",
    mightyForts: "शक्तिशाली किले",
    culture: "संस्कृति",
    livingArts: "जीवित कलाएं",
    cuisine: "व्यंजन",
    flavorSpice: "स्वाद और मसाला",
    played: "1.2k+ ने खेला",
    earnPoints: "अंक कमाएं",
    quizTime: "क्विज़ का समय",
  },
  mr: {
    // Navbar
    exploreMap: "नकाशा पहा", calendar: "दिनदर्शिका", bazaar: "बाजार", kids: "मुलांचा कोपरा", recommendation: "शिफारस", bookings: "तुमची बुकिंग", login: "लॉगिन", logout: "लॉगआउट", hi: "नमस्कार",
    // Calendar
    searchFestival: "सण शोधा...", upcoming: "आगामी सण", viewFull: "संपूर्ण दिनदर्शिका पहा", reminder: "सण स्मरणपत्र", noFestivals: "कोणतेही आगामी सण नाहीत.",
    // Kids
    kidsCorner: "मुलांचा कोपरा", kidsSub: "महाराष्ट्राच्या हृदयातून कथा आणि प्रश्नमंजुषा", watchStory: "कथा पहा", viewAll: "सर्व कथा पहा", cultureQuiz: "संस्कृती प्रश्नमंजुषा", startQuiz: "प्रश्नमंजुषा सुरू करा", beginJourney: "तुमचा प्रवास सुरू करा",
    // Shop
    heritageCrafts: "महाराष्ट्राची वारसा हस्तकला", craftedPieces: "तयार केलेल्या वस्तू", viewAllProducts: "सर्व पहा", explore: "शोधा", handmade: "हाताने बनवलेले",
    // Map
    interactiveExplorer: "इंटरॅक्टिव्ह एक्सप्लोरर",
    districtExplorer: "महाराष्ट्र जिल्हा शोधक", 
    clickDistrict: "जिल्हा निवडा", 
    maharashtraDistrict: "महाराष्ट्र जिल्हा",
    culturalRegion: "सांस्कृतिक प्रदेश",
    maharashtra: "महाराष्ट्र",
    viewDetails: "तपशील पहा →", 
    planTrip: "प्रवासाची योजना करा", 
    selectDistrict: "जिल्हा निवडा",
    districtDetailsAppear: "जिल्ह्याचा तपशील येथे दिसेल",
    clickAnyDistrict: "या पॅनेलमध्ये जिल्ह्याची प्रतिमा, वर्णन आणि जिल्हा-विशिष्ट माहिती पाहण्यासाठी नकाशावर कोणत्याही जिल्ह्यावर क्लिक करा.",
    noDescription: "या जिल्ह्यासाठी कोणतेही वर्णन उपलब्ध नाही.",
    //bottom slider
    forts: "किल्ले",
warliArt: "वारली कला",
lavani: "लावणी",
heritage: "वारसा",
traditions: "परंपरा",
    // Recommendation (✅ NEW KEYS ADDED)
    personalizedForYou: "तुमच्यासाठी वैयक्तिकृत",
    findPlacesLine1: "ठिकाणे शोधा",
    findPlacesLine2: "तुमच्यासाठी बनवलेली.",
    recommendationDesc: "तुम्हाला काय आवडते, तुम्ही कधी प्रवास करत आहात आणि तुम्हाला कसे फिरायला आवडते ते सांगा. आम्ही तुमच्यासाठी सर्वोत्तम महाराष्ट्रातील ठिकाणे शोधू.",
    planJourney: "माझ्या प्रवासाची योजना करा",
    // Mystery (✅ NEW KEYS ADDED)
    mysteryTitle: "महाराष्ट्र रहस्य", 
    playMystery: "रहस्य खेळा",
    interactiveGame: "इंटरॅक्टिव्ह गेम",
    mysteryDesc: "तुम्ही महाराष्ट्राचे लपलेले रहस्य ओळखू शकता का? सुज्ञपणे सुगावे वापरा आणि टॉप एक्सप्लोरर बना!",
    xpPoints: "500+ XP",
    clues: "3 सुगावे",
    nextCharacter: "पुढील पात्र!",
    legendText: "दंतकथा बना. एक्सप्लोरर्सना प्रेरित करा!",
    // BottomSlider (✅ NEW KEYS ADDED)
    mysticTrail: "मिस्टिक ट्रेल क्विझ",
    cultureQuizTitle: "संस्कृती प्रश्नमंजुषा",
    discoverHeritage: "महाराष्ट्राचा वारसा शोधा",
    cultureQuizDesc: "महाराष्ट्राचे भव्य किल्ले, जिवंत संस्कृती, समृद्ध पाक परंपरा आणि शतकानुशतके जुना वारसा याबद्दल तुमचे ज्ञान एका आकर्षक इंटरॅक्टिव्ह क्विझ अनुभवाद्वारे तपासा.",
    history: "इतिहास",
    mightyForts: "शक्तिशाली किल्ले",
    culture: "संस्कृती",
    livingArts: "जिवंत कला",
    cuisine: "पाककला",
    flavorSpice: "चव आणि मसाला",
    played: "1.2k+ खेळले",
    earnPoints: "गुण मिळवा",
    quizTime: "क्विझची वेळ",
  }
};

export const LanguageProvider = ({ children }) => {
  // Get from localStorage or default to English
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // Translation function
  const t = (key) => dictionary[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);