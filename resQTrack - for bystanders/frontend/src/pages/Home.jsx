import { Link } from "react-router-dom";
import { CheckCircle, AlertTriangle, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* Outer Box */}
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-10 flex flex-col items-center">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-blue-600 mb-8">resQTrack</h1>
        
        {/* Alerts Section */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Tow Vehicle Alert Card */}
          <div className="relative bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500 text-center">
            <div className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full">
              <Lock size={16} className="text-gray-500" />
            </div>
            <CheckCircle className="text-blue-500 mx-auto mb-3" size={50} />
            <h2 className="text-2xl font-semibold text-gray-800">Tow Vehicle Alert</h2>
            <p className="text-gray-600 text-sm mb-4">
              All users have access. Notify the public about tow vehicle incidents.
            </p>
            <Link
              to="/tow-vehicle-alert"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg"
            >
              SEND TOW ALERT
            </Link>
          </div>

          {/* Accident Alert Card */}
          <div className="relative bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 text-center">
            <div className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full">
              <Lock size={16} className="text-gray-500" />
            </div>
            <AlertTriangle className="text-orange-500 mx-auto mb-3" size={50} />
            <h2 className="text-2xl font-semibold text-gray-800">Accident Alert</h2>
            <p className="text-gray-600 text-sm mb-4">
              Restricted to administrators. Notify the public about emergencies.
            </p>
            <Link
              to="/accident-alert"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg"
            >
              SEND ACCIDENT ALERT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
