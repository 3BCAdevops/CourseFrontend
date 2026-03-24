import React from "react";
import CourseList from "./CourseList";
import EnrollmentList from "./EnrollmentList";
import "./App.css";


function App() {
  return (
    <div className="app-container">
      <h1 className="main-heading">Course Enrollment</h1>

      <div className="content">
        <CourseList />
        <EnrollmentList />
      </div>
    </div>
  );
}

export default App;