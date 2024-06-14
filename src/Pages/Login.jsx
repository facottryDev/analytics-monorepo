/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true); // Update login state
      setEmail("");
      setPassword("");
      setErrorMessage("");
      setShowErrorOverlay(false);
      setShowSuccessOverlay(true); // Show success message
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setShowErrorOverlay(true);
      } else {
        setErrorMessage("Internal server error");
        setShowErrorOverlay(true);
      }
    }
  };

  const handleOkClick = () => {
    setShowErrorOverlay(false);
    if (errorMessage === "User not found. Please signup.") {
      navigate("/registration");
    }
    setErrorMessage(""); // Reset error message
  };

  const handleSuccessOkClick = () => {
    setShowSuccessOverlay(false);
    navigate("/filters"); // Navigate to filters page after successful login
  };

  return (
    <div className="relative">
      {showErrorOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      )}
      {errorMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 z-30 shadow-md rounded-md flex flex-col items-center">
          <p className="text-lg mb-4">{errorMessage}</p>
          <button
            onClick={handleOkClick}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 mt-4"
          >
            OK
          </button>
        </div>
      )}
      {showSuccessOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      )}
      {showSuccessOverlay && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 z-30 shadow-md rounded-md flex flex-col items-center">
          <p className="text-lg mb-4">Login successful!</p>
          <button
            onClick={handleSuccessOkClick}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 mt-4"
          >
            OK
          </button>
        </div>
      )}
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-md shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl mb-4">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
