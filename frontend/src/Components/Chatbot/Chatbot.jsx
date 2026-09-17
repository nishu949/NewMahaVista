import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Minimize2, Maximize2, Sparkles } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! Welcome to Mystic Trails of Maharashtra! I'm your travel assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // City data
  const cityData = {
    pune: {
      name: "Pune",
      description: "The cultural capital of Maharashtra, known for its rich history, educational institutions, and vibrant culture.",
      highlights: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Lonavala", "Lavasa"],
      best_time: "October to March",
      famous_for: "Educational institutions, IT hubs, historical monuments, and Maharashtrian cuisine"
    },
    nashik: {
      name: "Nashik",
      description: "Known as the Wine Capital of India, Nashik is a holy city with the Godavari River flowing through it.",
      highlights: ["Trimbakeshwar Temple", "Pandavleni Caves", "Sula Vineyards", "Panchavati"],
      best_time: "July to March",
      famous_for: "Wine tourism, temples, and the Kumbh Mela"
    },
    jalgaon: {
      name: "Jalgaon",
      description: "Gateway to the famous Ajanta Caves, rich in history and cotton production.",
      highlights: ["Ajanta Caves", "Ekambareshwara Temple", "Bhadra Dam"],
      best_time: "October to March",
      famous_for: "Cotton production, Ajanta Caves, and historical monuments"
    },
    raigad: {
      name: "Raigad",
      description: "The capital of the Maratha Empire during the reign of Chhatrapati Shivaji Maharaj.",
      highlights: ["Raigad Fort", "Ropeway", "Mahad"],
      best_time: "November to February",
      famous_for: "Raigad Fort, Maratha history, and scenic views"
    }
  };

  // City names list for quick access
  const cityNames = Object.keys(cityData).map(key => cityData[key].name.toLowerCase());

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get chatbot response based on user input
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    
    // --- GREETINGS ---
    if (msg.match(/hi|hello|hey|namaste|नमस्ते/)) {
      return "Hello there! Welcome to Mystic Trails of Maharashtra! 🏔️ How can I assist you with your Maharashtra travel plans?";
    }

    // --- ABOUT MAHARASHTRA ---
    if (msg.match(/maharashtra|about|what is|tell me about/)) {
      return "🌟 **About Maharashtra:**\n\nMaharashtra is a vibrant state in western India known for its rich cultural heritage, historic forts, beautiful beaches, and delicious cuisine. Some highlights include:\n• Mumbai - The City of Dreams\n• Pune - The Cultural Capital\n• Nashik - Wine Capital of India\n• Ajanta & Ellora Caves - UNESCO World Heritage Sites\n\nWhat would you like to know more about?";
    }

    // --- BEST TIME TO VISIT ---
    if (msg.match(/best time|when to visit|weather|climate|season/)) {
      return "📅 **Best Time to Visit Maharashtra:**\n\nThe best time to visit Maharashtra is between **October and March** when the weather is pleasant and cool.\n\n• Monsoon (June-September): Beautiful greenery, but heavy rains\n• Summer (April-June): Hot, best to visit hill stations like Mahabaleshwar\n• Winter (October-March): Perfect for sightseeing and outdoor activities\n\nWhen are you planning to visit? I can recommend specific places!";
    }

    // --- CITY SPECIFIC ---
    const cityMatch = cityNames.find(city => msg.includes(city));
    if (cityMatch) {
      const cityKey = Object.keys(cityData).find(key => cityData[key].name.toLowerCase() === cityMatch);
      if (cityKey) {
        const city = cityData[cityKey];
        return `📍 **${city.name}**\n\n${city.description}\n\n✨ **Highlights:**\n• ${city.highlights.join('\n• ')}\n\n📅 **Best Time:** ${city.best_time}\n\n⭐ **Famous For:** ${city.famous_for}\n\nWould you like to know more about this city or book a trip here?`;
      }
    }

    // --- BOOKING ---
    if (msg.match(/book|booking|trip|package|tour/)) {
      return "🎫 **Booking Information:**\n\nTo book a trip, follow these steps:\n\n1️⃣ Go to our **Destinations** page\n2️⃣ Select a city you want to visit\n3️⃣ Choose your experience (Local or Heritage)\n4️⃣ Pick your travel date\n5️⃣ Fill in your details and confirm!\n\n📌 **Tip:** Make sure you're logged in to book.\n\nWould you like me to guide you to the booking page?";
    }

    // --- EXPERIENCES ---
    if (msg.match(/experience|local|heritage|tour|explore/)) {
      return "🎯 **Our Experiences:**\n\nWe offer two types of experiences:\n\n🏡 **Local Experience** (₹1,999):\n• Explore local attractions\n• Experience local culture and food\n• Visit popular landmarks\n\n🏛️ **Heritage Experience** (₹2,499):\n• Discover historic places\n• Cultural landmarks\n• Historical tours\n\nWhich experience interests you more?";
    }

    // --- PLACES TO VISIT ---
    if (msg.match(/places|attractions|sightseeing|tourist|visit/)) {
      return "🏰 **Must-Visit Places in Maharashtra:**\n\n• **Mumbai:** Gateway of India, Marine Drive, Elephanta Caves\n• **Pune:** Shaniwar Wada, Sinhagad Fort, Aga Khan Palace\n• **Nashik:** Trimbakeshwar Temple, Sula Vineyards\n• **Ajanta-Ellora:** UNESCO World Heritage Caves\n• **Mahabaleshwar:** Hill station with scenic views\n• **Lonavala-Khandala:** Beautiful hill stations\n\nWant to know more about any specific place?";
    }

    // --- FOOD ---
    if (msg.match(/food|cuisine|eat|restaurant|dish|meal/)) {
      return "🍽️ **Maharashtrian Cuisine:**\n\nMust-try dishes in Maharashtra:\n\n• 🍛 **Puran Poli:** Sweet flatbread\n• 🥘 **Misal Pav:** Spicy curry with bread\n• 🍢 **Vada Pav:** Mumbai's famous street food\n• 🍲 **Shrikhand:** Sweet yogurt dessert\n• 🌶️ **Bombay Duck:** Popular fish dish\n• 🥞 **Thalipeeth:** Savory pancake\n\nWhich dish are you most excited to try?";
    }

    // --- HELP ---
    if (msg.match(/help|support|assist|guide/)) {
      return "🆘 **How can I help you?**\n\nHere are some things I can assist with:\n\n• 📍 Information about cities (Pune, Nashik, etc.)\n• 🎫 Booking trips and experiences\n• 📅 Best time to visit places\n• 🏰 Places to visit in Maharashtra\n• 🍽️ Food recommendations\n• 💰 Package pricing\n\nJust ask me anything about Maharashtra travel!";
    }

    // --- PRICE ---
    if (msg.match(/price|cost|₹|rupee|money|budget|cheap|expensive/)) {
      return "💰 **Pricing Information:**\n\nOur experience packages:\n\n🏡 **Local Experience:** ₹1,999 per person\n🏛️ **Heritage Experience:** ₹2,499 per person\n\n**Additional Charges:**\n• Taxes: ₹200\n• Service Fee: ₹99\n\n👥 **Group discounts:** Available for groups of 5+\n\nWould you like me to calculate a price for your specific trip?";
    }

    // --- DEFAULT ---
    return "🤔 I'm not sure I understand. Let me try to help!\n\nI can tell you about:\n• 🏙️ Cities in Maharashtra (Pune, Nashik, etc.)\n• 🎫 Booking trips and experiences\n• 📅 Best time to visit\n• 🏰 Places to visit\n• 🍽️ Food recommendations\n\nCould you rephrase your question?\n\n**Quick Tip:** Try asking about a specific city like 'Tell me about Pune' or ask about booking!";
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot delay
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Quick reply buttons
  const quickReplies = [
    { label: "🏙️ Cities", text: "Tell me about Maharashtra cities" },
    { label: "🎫 Booking", text: "How do I book a trip?" },
    { label: "🏰 Places", text: "Best places to visit" },
    { label: "📅 Best Time", text: "Best time to visit" },
    { label: "🍽️ Food", text: "Maharashtrian food" },
  ];

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle chat window
  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  // Close chat
  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
        
        {/* Main Button */}
        <button
          onClick={toggleChat}
          className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/50 hover:scale-110 transition-all duration-300 group-hover:shadow-emerald-500/70"
        >
          {/* Sparkle Icon */}
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 animate-bounce">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          
          {/* Chat Icon */}
          <MessageCircle className="w-7 h-7" />
          
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
        </button>
        
        {/* Floating text */}
        <div className="absolute -top-12 right-0 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          👋 Need help? Chat with me!
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl shadow-black/20 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[550px]'} overflow-hidden flex flex-col border border-gray-100`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center relative">
            <span className="text-xl">🤖</span>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-emerald-600"></span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm flex items-center gap-1">
              Mystic Trails AI
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </h3>
            <p className="text-green-100 text-xs">✨ Online • Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 text-white" /> : <Minimize2 className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={closeChat}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50/80 to-white space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none shadow-md shadow-emerald-500/20'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(reply.text);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-full hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition whitespace-nowrap shadow-sm"
              >
                {reply.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className={`px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition shadow-md shadow-emerald-500/30`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;