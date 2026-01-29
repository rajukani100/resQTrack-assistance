import { useState, useEffect } from "react";
import { CreditCard, AlertTriangle, ShieldCheck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccidentCard() {
  const [cardNumber, setCardNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [location, setLocation] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Format card number
  const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 6);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => setError("Unable to fetch location.")
      );
    } else {
      setError("Geolocation is not supported.");
    }
  }, []); // Runs once when component mounts

  // Handle card input change
  const handleChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  // Handle send accident alert
  const handleSendAlert = async () => {
    if (cardNumber.length < 6) {
      setError("Please enter a valid card number.");
      return;
    }
    if (!location) {
      setError("Location not available. Please enable location services.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/send-accident-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowOtpBox(true);
      } else {
        setError(data.error || "Failed to send alert. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  // Verify OTP and send alert
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError("Please enter a valid OTP.");
      return;
    }
    if (!location) {
      setError("Location not available. Please enable location services.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber,
          otp,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.error || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
    setShowOtpBox(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center border-t-4 border-orange-500">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">resQTRACK</h1>
        <AlertTriangle className="text-orange-500 mx-auto mb-3" size={60} />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Accident Alert</h2>
        <p className="text-gray-600 text-sm mb-6">Enter the vehicle card number below to report an accident.</p>

        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-gray-700 font-medium">Enter Card Number</label>
          <div className="relative w-full">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={cardNumber}
              onChange={handleChange}
              maxLength="6"
              placeholder="123456"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <button onClick={handleSendAlert} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg w-full">
          SEND ACCIDENT ALERT
        </button>
      </div>

      {showOtpBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
            <ShieldCheck className="text-green-500 mx-auto mb-3" size={50} />
            <h2 className="text-xl font-semibold text-gray-800">OTP Verification</h2>
            <p className="text-gray-600 text-sm mb-4">Enter the OTP sent to your mobile number.</p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength="6"
              placeholder="Enter OTP"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button onClick={handleVerifyOtp} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg w-full">
              VERIFY OTP
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-full shadow-lg flex items-center justify-center">
            <CheckCircle className="text-green-500" size={80} />
          </div>
          <p className="text-white text-lg font-semibold mt-4">Accident alert sent successfully!</p>
        </div>
      )}
    </div>
  );
}
