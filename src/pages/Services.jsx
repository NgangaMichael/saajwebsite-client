import React from "react";
import { ToastContainer } from "react-toastify";
import { Construction } from "lucide-react"; // Import an icon for better visuals
import "react-toastify/dist/ReactToastify.css";

export default function Services() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div>
        <h2 className="h5">Services</h2>
        <hr />
      </div>

      {/* Centered Coming Soon Section */}
      <div className="flex-grow d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="mb-4 d-flex justify-content-center">
            <div className="p-4 bg-light rounded-circle shadow-sm">
              <Construction size={64} className="text-warning" />
            </div>
          </div>
          
          <h1 className="display-4 font-weight-bold text-dark">Coming Soon</h1>
          <p className="text-muted lead">
            We are working hard to bring you new services. <br />
            Stay tuned for updates, {loggedInUser?.username || "User"}!
          </p>
          
          <div className="mt-4">
             <div className="spinner-grow text-primary spinner-grow-sm mx-1" role="status"></div>
             <div className="spinner-grow text-primary spinner-grow-sm mx-1" role="status" style={{animationDelay: '0.2s'}}></div>
             <div className="spinner-grow text-primary spinner-grow-sm mx-1" role="status" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}