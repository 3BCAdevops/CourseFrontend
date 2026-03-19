import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL;

function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [droppingId, setDroppingId] = useState(null);

  // 🔥 SAFE API CALL
  const loadEnrollments = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/enrollments`);

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      if (Array.isArray(data)) {
        setEnrollments(data);
      } else {
        setEnrollments([]);
      }

    } catch (err) {
      console.error("Enrollment API error:", err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  // 🔥 DROP FUNCTION
  const handleDrop = async (id) => {
    try {
      setDroppingId(id);

      const res = await fetch(`${API_BASE}/api/enrollments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Drop failed");

      await loadEnrollments();
      alert("Enrollment dropped");

    } catch (e) {
      console.error(e);
      alert("Could not drop enrollment");
    } finally {
      setDroppingId(null);
    }
  };

  // 🔥 SEARCH FILTER (SAFE)
  const filteredEnrollments = enrollments.filter((e) =>
    (e.courseId?.toString().includes(search) ||
      e.studentId?.toString().includes(search))
  );

  if (loading) return <p>Loading enrollments...</p>;

  return (
    <div>
      <h2>Enrollments</h2>

      {/* TOTAL COUNT */}
      <p>Total Enrollments: {enrollments.length}</p>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by courseId or studentId"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "90%" }}
      />

      {filteredEnrollments.length === 0 && <p>No enrollments found.</p>}

      <ul>
        {filteredEnrollments.map((e) => (
          <li key={e.id}>
            ID {e.id} – courseId: {e.courseId}, studentId: {e.studentId}{" "}
            <button
              onClick={() => handleDrop(e.id)}
              disabled={droppingId === e.id}
            >
              {droppingId === e.id ? "Dropping..." : "Drop"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EnrollmentList;