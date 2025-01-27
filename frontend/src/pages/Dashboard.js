import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

import Cars from "../components/Cars.js";
import ManageCategories from "../components/ManageCategory.js";

const Dashboard = () => {
  const [carCount, setCarCount] = useState(0);
  const [activeTab, setActiveTab] = useState("cars"); // Tabs: 'cars' or 'categories'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/cars/count",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCarCount(response.data.count || 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching car count:", err);
        setError("Failed to fetch car count. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarCount();
  }, []);

  const renderTabContent = () => {
    if (activeTab === "cars") {
      return (
        <div>
          <h3>Cars</h3>
          <p>
            Total Cars Registered: {DOMPurify.sanitize(carCount.toString())}
          </p>
          <Cars />
        </div>
      );
    } else if (activeTab === "categories") {
      return (
        <div>
          <h3>Categories</h3>
          <p>Manage car categories here.</p>
          <ManageCategories />
        </div>
      );
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{DOMPurify.sanitize(error)}</p>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        {/* Tab Buttons */}
        {["cars", "categories"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              backgroundColor: activeTab === tab ? "#007BFF" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
