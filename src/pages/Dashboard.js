import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const tenantId = user?.username || "trainer1";

  // Fetch courses
  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`, {
      headers: { "x-tenant-id": tenantId },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.items || []))
      .catch(() =>
        setError("Unable to load courses. Please try again later.")
      );
  }, [tenantId]);

  // Load Razorpay checkout script if not already loaded
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (course) => {
    setPaymentLoading(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Refresh and try again.");
      }

      const resp = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          course_id: course.course_id,
        }),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to create order");
      }

      const order = await resp.json();
      return order;
    } catch (err) {
      console.error("createOrder error:", err);
      setError(err.message || "Failed to create order");
      setPaymentLoading(false);
      return null;
    }
  };

  const openRazorpayCheckout = (order, course) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Lotus LMS",
      description: course.title || "Course Purchase",
      order_id: order.id,
      handler: function (response) {
        // Successful payment. You should verify payment on backend.
        console.log("razorpay success response", response);
        alert("Payment successful — you are enrolled!");
        setSelectedCourse(null);
        setPaymentLoading(false);
        // Optionally: call backend to verify signature and persist payment
      },
      prefill: {
        name: user?.name || user?.username || "",
        email: user?.email || "",
      },
      notes: {
        course_id: course.course_id,
        tenant_id: tenantId,
      },
      theme: {
        color: "#4F46E5",
      },
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed", response);
      setError(
        response?.error?.description || "Payment failed. Please try again."
      );
      setPaymentLoading(false);
    });

    rzp.open();
  };

  const handleEnrollClick = async (course) => {
    // For free courses, skip payment flow
    if (course.price === 0) {
      alert("You are now enrolled in this free course!");
      return;
    }

    setSelectedCourse(course);
    setPaymentLoading(true);
    const order = await createOrder(course);
    if (order) {
      openRazorpayCheckout(order, course);
    }
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
                onClick={() => handleEnrollClick(course)}
                className="buy-btn enroll-button"
                disabled={paymentLoading}
              >
                {paymentLoading && selectedCourse?.course_id === course.course_id
                  ? "Processing..."
                  : course.price === 0
                  ? "Enroll for Free"
                  : "Enroll Now"}
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
            <p>
              Amount: <strong>{selectedCourse.currency} {selectedCourse.price}</strong>
            </p>
            <div style={{ marginTop: 12 }}>
              <small>
                The Razorpay checkout will open. Complete the payment to get
                access to the course.
              </small>
            </div>
            <button
              className="cancel-btn"
              onClick={() => {
                setSelectedCourse(null);
                setPaymentLoading(false);
              }}
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