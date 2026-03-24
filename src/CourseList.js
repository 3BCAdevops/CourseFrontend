import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL;

function CourseList() {
  const [courses, setCourses] = useState([]);   // MUST be array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = 1;

  // ================= LOAD COURSES =================
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/courses`);

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      console.log("API RESPONSE =", data);

      // 🔐 SAFETY CHECK (MOST IMPORTANT)
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
        setError("Invalid data from server");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load courses");
      setCourses([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // ================= ENROLL =================
  const handleEnroll = async (courseId) => {
    try {
      const res = await fetch(`${API_BASE}/api/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          studentId,
        }),
      });

      if (!res.ok) throw new Error("Enroll failed");

      alert("Enrolled successfully");
      
     window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Enroll failed");
    }
  };

  // ================= CREATE COURSE =================
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateCourse = async () => {
    if (!newName.trim()) {
      alert("Course name required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          enrolledCount: 0,
        }),
      });

      if (!res.ok) throw new Error("Create failed");

      setNewName("");
      setNewDescription("");
      loadCourses();
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  // ================= UI =================
  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Create New Course</h2>

      <input
        placeholder="Course name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <br />

      <input
        placeholder="Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <br />

      <button onClick={handleCreateCourse}>Add Course</button>

      <h2>Available Courses</h2>

      {courses.length === 0 && <p>No courses found.</p>}

      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            – {c.name} (Enrolled: {c.enrolledCount ?? 0}){" "}
            <button onClick={() => handleEnroll(c.id)}>Enroll</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
