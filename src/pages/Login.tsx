import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple validation for empty fields
    if (!rollNo || !password || !phone) {
      setError("All fields are required.");
      return;
    }

    // Navigate to Home Page on button click (assuming valid input)
    setError(null); // Clear any previous error
    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Roll Number Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Roll Number</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter Roll Number"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Phone Number"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
