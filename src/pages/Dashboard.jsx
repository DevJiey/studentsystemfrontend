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

      <h1>Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Students</h3>
          <h2>{totalStudents}</h2>
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

    </div>
  );
}

export default Dashboard;