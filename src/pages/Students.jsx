import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Students() {

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [formData, setFormData] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    course: "",
    year_level: "",
    email: ""
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedStudent) {

        const response = await axios.put(
          `http://localhost:5000/students/${selectedStudent.id}`,
          formData
        );

        setStudents(
          students.map((student) =>
            student.id === selectedStudent.id
              ? response.data
              : student
          )
        );

        alert("Student updated successfully");

      } else {

        const response = await axios.post(
          "http://localhost:5000/students",
          formData
        );

        setStudents([...students, response.data]);

        alert("Student added successfully");
      }

      setFormData({
        student_number: "",
        first_name: "",
        last_name: "",
        course: "",
        year_level: "",
        email: ""
      });

      setSelectedStudent(null);

    } catch (error) {
      console.error(error);
      alert("Failed to save student");
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }
    try {

      await axios.delete(
        `http://localhost:5000/students/${id}`
      );

      setStudents(
        students.filter(
          (student) => student.id !== id
        )
      );

      alert("Student deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete student");
    }
  };
  const handleEdit = (student) => {

    setSelectedStudent(student);

    setFormData({
      student_number: student.student_number,
      first_name: student.first_name,
      last_name: student.last_name,
      course: student.course,
      year_level: student.year_level,
      email: student.email
    });

  };

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

  return (
    <div className="container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="first_name">First Name</option>
          <option value="course">Course</option>
          <option value="year_level">Year Level</option>
        </select>
      </div>
      <button
        className="add-student-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "+ Add Student"}
      </button>
      {showForm && (
      <form
        className="form-container"
        onSubmit={handleSubmit}
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
          {selectedStudent ? "Update Student" : "Add Student"}
        </button>
      </form>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Number</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Course</th>
              <th>Year Level</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students
              .filter((student) =>
                student.first_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||

                student.last_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||

                student.student_number
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||

                student.course
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => {

                if (!sortBy) return 0;

                return String(a[sortBy]).localeCompare(
                  String(b[sortBy])
                );

              })
              .map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.student_number}</td>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.course}</td>
                  <td>{student.year_level}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;