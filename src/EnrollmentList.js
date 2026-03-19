import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL;

function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // NEW STATES
  const [search, setSearch] = useState("");
  const [droppingId, setDroppingId] = useState(null);

  const loadEnrollments = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/enrollments`);
    const data = await res.json();
    setEnrollments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

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

  // ✅ FIXED SEARCH (handles string + number safely)
  const filteredEnrollments = enrollments.filter((e) =>
    (e.courseId?.toString().includes(search) ||
      e.studentId?.toString().includes(search))
  );

  if (loading) return <p>Loading enrollments...</p>;

  return (
    <div>
      <h2>Enrollments</h2>

      {/* Total Count */}
      <p>Total Enrollments: {enrollments.length}</p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by courseId or studentId"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
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