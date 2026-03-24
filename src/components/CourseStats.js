import React from "react";

function CourseStats({ courses }) {
  return (
    <h3>Total Courses: {courses.length}</h3>
  );
}

export default CourseStats;