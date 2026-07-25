import { useEffect, useState } from "react";
import axios from "axios";

function App() {



  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    course: "",
    year_level: "",
    email: ""
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/students",
        formData
      );

      setStudents([...students, response.data]);

      setFormData({
        student_number: "",
        first_name: "",
        last_name: "",
        course: "",
        year_level: "",
        email: ""
      });

      alert("Student added successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to add student");
    }
  };
  const handleDelete = async (id) => {
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
    <div>
      <h1>Student Management System</h1>
      <form onSubmit={handleSubmit}>

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

        <button type="submit">
          Add Student
        </button>

      </form>
      <table border="1">
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
          {students.map((student) => (
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
  );
}

export default App;