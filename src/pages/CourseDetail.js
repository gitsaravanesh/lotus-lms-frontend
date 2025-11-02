import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user, logout } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const tenantId = user?.username || "trainer1";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/courses/${encodeURIComponent(courseId)}`,
          {
            headers: {
              "x-tenant-id": tenantId,
            },
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to fetch course");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [API_BASE_URL, courseId, tenantId]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card">
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="dashboard">
        <div className="card">
          <p style={{ color: "red" }}>{error || "Course not found."}</p>
          <button onClick={() => navigate("/dashboard")}>⬅ Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="card" style={{ maxWidth: "500px", margin: "auto" }}>
        <h2>{course.title}</h2>
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
        <p>
          <b>Created At:</b> {course.created_at}
        </p>

        <button
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back to Courses
        </button>
        <button
          style={{
            marginTop: "10px",
            background: "#28a745",
          }}
          onClick={() => alert("Payment/Enrollment coming soon!")}
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;