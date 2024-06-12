import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [requiredfields, setRequiredFields] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      setRequiredFields(true);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      try {
        const response = await axios.post("http://localhost:5000/signup", {
          email,
          password,
          image,
          name,
        });
        console.log(response.data);
        const token = response.data.token;
        localStorage.setItem("cookie", token);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setImage("");
        setPasswordError("");
        setShowSuccessOverlay(true);
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
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.value);
  };

  const handleOkClick = () => {
    setErrorMessage("");
    setShowErrorOverlay(false);
    setShowSuccessOverlay(false);
    navigate("/");
  };
  
  const handleRegistered = () => {
    navigate("/home");
  };
    
  const handleRequiredFields = () => {
    setErrorMessage("");
    setShowErrorOverlay(false);
    setRequiredFields(false);
  };

  return (
    <>
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
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 z-30 shadow-md rounded-md flex flex-col items-center">
            <p className="text-lg mb-4">Registration successful!</p>
            <button
              onClick={handleRegistered}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 mt-4"
            >
              OK
            </button>
          </div>
        )}
        {requiredfields && (
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
        )}
        {requiredfields && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 z-30 shadow-md rounded-md flex flex-col items-center">
            <p className="text-lg mb-4">Please fill all the required fields</p>
            <button
              onClick={handleRequiredFields}
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
            <h2 className="text-2xl mb-4">Registration</h2>
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
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL:
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={handleImageChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the Terms and Conditions
              </label>
            </div>
            <button
              type="submit"
              className={`bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${!termsChecked ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={!termsChecked}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
