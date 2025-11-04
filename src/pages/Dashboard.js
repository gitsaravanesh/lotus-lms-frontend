import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import "../styles.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
          headers: { "x-tenant-id": "trainer1" },
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data.items || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load courses. Please try again later.");
      }
    };
    fetchCourses();
  }, [API_BASE_URL]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = (callback) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.dataset.payment_button_id = "pl_RblcRcpAdBysab"; // your payment button id
    script.onload = callback;
    document.body.appendChild(script);
  };

  const handleBuy = (course) => {
    // Cleanup any old Razorpay script if exists
    const oldScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/payment-button.js"]');
    if (oldScript) oldScript.remove();

    loadRazorpayScript(() => {
      console.log("Razorpay Checkout Loaded for", course.title);
    });
  };

  return (
    <div className="dashboard">
      <div className="card">
        <h2>✅ Logged in successfully!</h2>
        <p>Welcome, {user?.name || "User"} 🎉</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="courses-section">
        <h3>📚 Available Courses</h3>
        {error ? (
          <p className="error-text">{error}</p>
        ) : courses.length === 0 ? (
          <p>Loading courses...</p>
        ) : (
          <div className="course-list">
            {courses.map((course) => (
              <div key={course.course_id} className="course-card">
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <p>
                  💰 <b>{course.price === 0 ? "Free" : `₹${course.price} ${course.currency}`}</b>
                </p>
                {course.price === 0 ? (
                  <button className="free-btn">Enroll for Free</button>
                ) : (
                  <button className="buy-btn" onClick={() => handleBuy(course)}>
                    Buy Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;