import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const response = await fetch("https://todobackend-kqc1.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.message === "User registered") {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setAuthError(data.message || "Signup failed");
      }
    } catch (err) {
      setAuthError("Network error");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Sign Up</h2>

      {authError && <p className="text-red-500 text-center mb-4">{authError}</p>}
      {success && <p className="text-green-500 text-center mb-4">Signup successful! Redirecting...</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          {authLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <span className="text-gray-700">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
