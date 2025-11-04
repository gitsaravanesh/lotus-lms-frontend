import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses
  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`, {
      headers: { "x-tenant-id": "trainer1" },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.items || []))
      .catch(() => setError("Unable to load courses. Please try again later."));
  }, []);

  // Load Razorpay button dynamically inside a form
  useEffect(() => {
    if (selectedCourse) {
      const container = document.getElementById("razorpay-container");
      container.innerHTML = "";

      // Create a form element
      const form = document.createElement("form");
      form.setAttribute("id", "razorpay-form");

      // Create Razorpay script inside that form
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_RblcRcpAdBysab");
      script.async = true;

      form.appendChild(script);
      container.appendChild(form);
    }
  }, [selectedCourse]);

  return (
    <div className="dashboard">
      <div className="card">
        <h2>✅ Logged in successfully!</h2>
        <p>Welcome, {user?.name || "User"} 🎉</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="courses-section">
        <h3>📚 Available Courses</h3>
        {error && <p className="error">{error}</p>}

        <div className="course-list">
          {courses.map((course) => (
            <div className="course-card" key={course.course_id}>
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <p>
                💰 <strong>{course.price}</strong> {course.currency}
              </p>
              <button
                onClick={() => setSelectedCourse(course)}
                className="buy-btn"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div className="payment-modal">
          <div className="payment-card">
            <h4>Proceed to Payment</h4>
            <p>
              You are purchasing: <strong>{selectedCourse.title}</strong>
            </p>
            <div id="razorpay-container"></div>
            <button
              className="cancel-btn"
              onClick={() => setSelectedCourse(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;