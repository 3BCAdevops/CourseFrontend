import React from "react";

function CourseSearch({ search, setSearch }) {
  return (
    <div style={{marginBottom:"10px"}}>
      <input
        type="text"
        placeholder="Search course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default CourseSearch;