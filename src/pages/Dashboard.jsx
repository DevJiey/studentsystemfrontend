import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const totalStudents = students.length;

  const bsitCount = students.filter(
    (student) => student.course === "BSIT"
  ).length;

  const bscsCount = students.filter(
    (student) => student.course === "BSCS"
  ).length;

  const bsemcCount = students.filter(
    (student) => student.course === "BSEMC"
  ).length;

  return (
    <div>

      <h1>Analytics Overview</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Students</h3>
          <h2>{totalStudents}</h2>
          <p>Registered Students</p>
        </div>

        <div className="card">
          <h3>BSIT</h3>
          <h2>{bsitCount}</h2>
        </div>

        <div className="card">
          <h3>BSCS</h3>
          <h2>{bscsCount}</h2>
        </div>

        <div className="card">
          <h3>BSEMC</h3>
          <h2>{bsemcCount}</h2>
        </div>

      </div>
      <div className="quick-actions-card">

        <h3>Quick Actions</h3>

        <div className="quick-actions-buttons">

          <button>Add Student</button>

          <button>Generate Report</button>

          <button>Export Data</button>

        </div>

      </div>
      <div className="recent-students-card">

        <h3>Recent Students</h3>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Year</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>John Doe</td>
              <td>BSIT</td>
              <td>3</td>
            </tr>

            <tr>
              <td>Jane Smith</td>
              <td>BSCS</td>
              <td>2</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default Dashboard;