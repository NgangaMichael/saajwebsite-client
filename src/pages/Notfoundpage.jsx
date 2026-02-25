import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, AlertCircle } from "lucide-react";

export default function Notfoundpage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
      <div className="text-center">
        {/* Visual Element */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle size={64} className="text-red-600" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-[-40px] mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <User size={18} />
            Go to Profile
          </button>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="mt-16 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SAAJ NAIROBI
      </div>
    </div>
  );
}