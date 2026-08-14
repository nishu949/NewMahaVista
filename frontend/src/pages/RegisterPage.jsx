import React from 'react';

const RegisterPage = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col font-sans text-gray-800"
      style={{ 
        // Using a placeholder image of a misty fort/mountain landscape
        backgroundImage: "url('https://images.unsplash.com/photo-1596740625377-50b0cd93a1f4?auto=format&fit=crop&q=80&w=2000')" 
      }}
    >
      {/* Overlay to ensure text readability against the background */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center py-6 px-10 text-white">
        <div className="flex items-center gap-2">
          {/* Simple logo placeholder */}
          <div className="w-8 h-8 bg-amber-600 rounded-sm flex items-center justify-center font-bold text-xl">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-wider uppercase text-amber-500">
              Mystic Trails of
            </h1>
            <h2 className="text-lg font-semibold leading-none uppercase tracking-widest text-white">
              Maharashtra
            </h2>
          </div>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#" className="hover:text-amber-400 transition-colors">Explore</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Tours</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Destinations</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Galleries</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a>
        </div>
      </nav>

      {/* Main Form Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Discover the magic of Maharashtra with us!</p>
          </div>

          <form className="space-y-6">
            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Rohan Deshmukh"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  placeholder="rohan.d@email.com"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  placeholder="rohanhiking"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex">
                  <select className="px-2 py-2 border border-gray-300 border-r-0 rounded-l-lg bg-gray-50 focus:outline-none text-gray-600 text-sm">
                    <option>🇮🇳 +91</option>
                  </select>
                  <input 
                    type="tel" 
                    placeholder="98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Create Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" />
                <span className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-amber-600 hover:underline font-medium">Terms & Conditions</a> and <a href="#" className="text-amber-600 hover:underline font-medium">Privacy Policy</a>
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" />
                <span className="text-sm text-gray-700">
                  Subscribe to newsletter for exclusive deals
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#c27628] hover:bg-[#a6621f] text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-4 shadow-md"
            >
              REGISTER NOW
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Or sign up with:</p>
            <div className="flex justify-center gap-4">
              {/* Simple placeholder circles for social icons */}
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm text-red-500 font-bold">G</button>
              <button className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors shadow-sm text-blue-600 font-bold">f</button>
              <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center transition-colors shadow-sm text-white font-bold"></button>
            </div>
            
            <p className="mt-6 text-sm text-gray-700">
              Already have an account? <a href="#" className="text-[#c27628] hover:underline font-bold">Log In</a>
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-[#6b4724]/90 backdrop-blur-sm text-white/80 py-4 px-10 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex gap-4 mb-2 md:mb-0">
          <a href="#" className="hover:text-white transition-colors">Explore</a>
          <a href="#" className="hover:text-white transition-colors">Tours</a>
          <a href="#" className="hover:text-white transition-colors">Destinations</a>
          <a href="#" className="hover:text-white transition-colors">Galleries</a>
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        </div>
        <p>© 2026 Mystic Trails of Maharashtra</p>
      </footer>
    </div>
  );
};

export default RegisterPage;