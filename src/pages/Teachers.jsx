import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Teachers() {

  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    employee_number: "",
    first_name: "",
    last_name: "",
    email: "",
    department: ""
  });

  const fetchTeachers = () => {
    axios
      .get("http://localhost:5000/teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setSelectedTeacher(null);
    setFormData({ employee_number: "", first_name: "", last_name: "", email: "", department: "" });
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      employee_number: teacher.employee_number,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      department: teacher.department || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setFormData({ employee_number: "", first_name: "", last_name: "", email: "", department: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedTeacher) {

        const response = await axios.put(
          `http://localhost:5000/teachers/${selectedTeacher.id}`,
          formData
        );

        setTeachers(
          teachers.map((teacher) =>
            teacher.id === selectedTeacher.id ? response.data : teacher
          )
        );

        alert("Teacher updated successfully");

      } else {

        const response = await axios.post(
          "http://localhost:5000/teachers",
          formData
        );

        setTeachers([...teachers, response.data]);

        alert("Teacher added successfully");
      }

      closeModal();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save teacher");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(`http://localhost:5000/teachers/${id}`);

      setTeachers(teachers.filter((teacher) => teacher.id !== id));

      alert("Teacher deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="container">

      <div className="controls">
        <input
          type="text"
          placeholder="Search teacher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-student-btn" onClick={openAddModal}>
        + Add Teacher
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee #</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {teachers
              .filter((teacher) =>
                teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.employee_number.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.employee_number}</td>
                  <td>{teacher.first_name}</td>
                  <td>{teacher.last_name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.department}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(teacher)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <div className="modal-header">
              <h3>{selectedTeacher ? "Edit Teacher" : "Add Teacher"}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  type="text"
                  name="employee_number"
                  placeholder="Employee Number"
                  value={formData.employee_number}
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="department"
                  placeholder="Department (optional)"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <button className="submit-btn" type="submit">
                {selectedTeacher ? "Update Teacher" : "Add Teacher"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Teachers;