import { useState } from "react";
import { CreditCard, Truck, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TowVehicleCard() {
  const [cardNumber, setCardNumber] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Format card number
  const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 6);


  // Get user's geolocation
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => reject("Unable to fetch location.")
      );
    });
  };

  // Handle card input change
  const handleChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
    setError("");
  };

  // Send Tow Alert
  const handleSendAlert = async () => {
    if (cardNumber.length < 6) {
      setError("Enter a valid card number.");
      return;
    }

    try {
      const userLocation = await getUserLocation();
      setLocation(userLocation);

      const response = await fetch("http://localhost:5001/api/send-tow-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }),
      });

      const data = await response.json(); // ✅ Parse response before using it
console.log("Response from server:", data);

      console.log(response.success);
      
      if (response.ok) {
       
        setSuccess(true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("Failed to send alert.");
      }
    } catch (err) {
      setError(err || "Error sending request.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg text-center border-t-4 border-blue-500">
        <Truck className="text-blue-500 mx-auto mb-4" size={60} />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tow Vehicle Alert</h1>
        <p className="text-gray-600 text-sm mb-6">Enter the vehicle card number below to issue a tow alert.</p>

        {/* Card Number Input */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-gray-700 font-medium">Enter Card Number</label>
          <div className="relative w-full">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={cardNumber}
              onChange={handleChange}
              maxLength="6"
              placeholder="123456"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-lg"
            />
          </div>
          {error && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <XCircle className="mr-1" size={18} /> {error}
            </div>
          )}
        </div>

        {/* Alert Button */}
        <button
          onClick={handleSendAlert}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg w-full"
        >
          SEND TOW ALERT
        </button>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-full shadow-lg flex items-center justify-center">
            <CheckCircle className="text-green-500" size={80} />
          </div>
          <p className="text-white text-lg font-semibold mt-4">Tow alert sent successfully!</p>
        </div>
      )}
    </div>
  );
}
