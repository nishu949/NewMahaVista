import { Mail, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loginUsername, setLoginUsername] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (isLogin) {
      try {
        const response = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginUsername,
            password: password,
          }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
          alert("login successful");

          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", data.user.email);
          localStorage.setItem("userData", JSON.stringify(data.user));


          // Check if user was redirected here from another page
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get("redirect");

          // If redirect exists, go there.
          // Otherwise, go to home as before.
          navigate(redirect || "/home");
        } else {
          alert("Invalid credentials");
        }
      } catch (error) {
        alert("Server error. Please try again.");
      }
    } else {
      if (!registerName || !registerEmail || !password || !confirmPassword) {
        alert("Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: registerName,
            email: registerEmail,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful!");
          setIsLogin(true);

          setRegisterName("");
          setRegisterEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          alert(data.detail || "Registration failed");
        }
      } catch (error) {
        alert("Server error. Please try again.");
      }
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setLoginUsername("");
    setRegisterName("");
    setRegisterEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block">
        <img
          src="/images/fort.png"
          alt="Fort"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute top-20 left-10 text-white max-w-xl">
          <h1 className="text-4xl font-bold text-orange-300">
            Mystic Trails of Maharashtra
          </h1>

          <h2 className="text-3xl mt-4 font-semibold">
            Discover the Untold Stories
          </h2>

          <p className="mt-4 text-gray-200">
            Your gateway to hidden forts, ancient caves and sacred forests.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2">
            {isLogin ? "Welcome Back, Traveler" : "Join the Expedition"}
          </h2>

          <p className="text-center text-gray-500 mb-6">
            {isLogin
              ? "Resume Your Expedition"
              : "Create your account to begin your journey"}
          </p>

          {!isLogin && (
            <div className="mb-4">
              <label className="text-sm font-medium">Full Name</label>

              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <User className="w-4 h-4 text-gray-500 mr-2" />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium">Email</label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Mail className="w-4 h-4 text-gray-500 mr-2" />

              <input
                type="text"
                placeholder={
                  isLogin ? "Enter Email" : "Enter your email"
                }
                value={isLogin ? loginUsername : registerEmail}
                onChange={(e) =>
                  isLogin
                    ? setLoginUsername(e.target.value)
                    : setRegisterEmail(e.target.value)
                }
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Password</label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Lock className="w-4 h-4 text-gray-500 mr-2" />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="text-sm font-medium">
                Confirm Password
              </label>

              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <Lock className="w-4 h-4 text-gray-500 mr-2" />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-orange-500">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            {isLogin ? "ENTER THE TRAILS" : "CREATE ACCOUNT"}
          </button>

          <p className="text-center text-sm mt-6">
            {isLogin ? "New here? " : "Already have an account? "}

            <button
              type="button"
              onClick={handleToggle}
              className="text-orange-500 font-semibold ml-1"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          <div className="mt-4 text-center">
            <span className="text-gray-400 text-sm">Are you an admin? </span>
              <button
                  onClick={() => navigate("/admin/login")}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition"
                   >
                    Go to Admin Panel →
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}