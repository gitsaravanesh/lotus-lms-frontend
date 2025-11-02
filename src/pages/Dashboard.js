import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read from .env
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // For now, we assume trainer_id = user.username (or fallback)
  const tenantId = user?.username || "trainer1";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/courses`, {
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to fetch courses");
        }

        const data = await res.json();
        setCourses(data.items || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [API_BASE_URL, tenantId]);

  return (
    <div className="dashboard">
      <div className="card user-card">
        <h2>✅ Logged in successfully!</h2>
        <p>Welcome, {user?.name || user?.username || "User"} 🎉</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="courses-section">
        <h3>📚 Available Courses</h3>

        {loading && <p>Loading courses...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p>No courses available yet.</p>
        )}

        <div className="course-list">
          {courses.map((course) => (
            <div key={course.course_id} className="course-card">
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <p>
                <b>Instructor:</b> {course.instructor_id}
              </p>
              <p>
                <b>Price:</b>{" "}
                {course.price === 0
                  ? "Free"
                  : `${course.price} ${course.currency}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;