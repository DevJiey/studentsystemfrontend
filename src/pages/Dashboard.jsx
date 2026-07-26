import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    course: "",
    year_level: "",
    email: ""
  });

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
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/students",
        formData
      );

      setStudents([...students, response.data]);

      alert("Student added successfully");

      setFormData({
        student_number: "",
        first_name: "",
        last_name: "",
        course: "",
        year_level: "",
        email: ""
      });

      setShowAddForm(false);

    } catch (error) {
      console.error(error);
      alert("Failed to add student");
    }
  };

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
  const recentStudents = [...students]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

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

          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Close Form" : "Add Student"}
          </button>

          <button>Generate Report</button>

          <button>Export Data</button>

        </div>
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header">
                <h3>Add Student</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  ✕
                </button>
              </div>

              <form
                className="form-container"
                onSubmit={handleAddStudent}
              >
                <div className="form-grid">
                  <input
                    type="text"
                    name="student_number"
                    placeholder="Student Number"
                    value={formData.student_number}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="course"
                    placeholder="Course"
                    value={formData.course}
                    onChange={handleChange}
                  />

                  <input
                    type="number"
                    name="year_level"
                    placeholder="Year Level"
                    value={formData.year_level}
                    onChange={handleChange}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <button
                  className="submit-btn"
                  type="submit"
                >
                  Add Student
                </button>

                <button
                  type="button"
                  className="submit-btn cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
      <div className="recent-students-card">

        <h3>Recent Students</h3>
        <div className="recent-students-scroll">
          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Year</th>
              </tr>
            </thead>

            <tbody>

              {recentStudents.length === 0 ? (
                <tr>
                  <td colSpan="3">No students yet</td>
                </tr>
              ) : (
                recentStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.first_name} {student.last_name}</td>
                    <td>{student.course}</td>
                    <td>{student.year_level}</td>
                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

      </div>

    </div>

  );
}

export default Dashboard;