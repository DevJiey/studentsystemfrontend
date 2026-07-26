import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Grades() {

  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    class_id: "",
    grade: "",
    remarks: ""
  });

  const fetchGrades = () => {
    axios
      .get("http://localhost:5000/grades")
      .then((response) => {
        setGrades(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchClasses = () => {
    axios
      .get("http://localhost:5000/classes")
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setSelectedGrade(null);
    setFormData({ student_id: "", class_id: "", grade: "", remarks: "" });
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setSelectedGrade(record);
    setFormData({
      student_id: record.student_id || "",
      class_id: record.class_id || "",
      grade: record.grade || "",
      remarks: record.remarks || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGrade(null);
    setFormData({ student_id: "", class_id: "", grade: "", remarks: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedGrade) {

        await axios.put(
          `http://localhost:5000/grades/${selectedGrade.id}`,
          formData
        );

        alert("Grade updated successfully");

      } else {

        await axios.post(
          "http://localhost:5000/grades",
          formData
        );

        alert("Grade recorded successfully");
      }

      fetchGrades();
      closeModal();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save grade");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(`http://localhost:5000/grades/${id}`);

      setGrades(grades.filter((record) => record.id !== id));

      alert("Grade record deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete grade record");
    }
  };

  return (
    <div className="container">

      <div className="controls">
        <input
          type="text"
          placeholder="Search by class name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-student-btn" onClick={openAddModal}>
        + Add Grade
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Grade</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {grades
              .filter((record) =>
                (record.class_name || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>
                    {record.student_first_name
                      ? `${record.student_first_name} ${record.student_last_name}`
                      : "-"}
                  </td>
                  <td>{record.class_name || "-"}</td>
                  <td>{record.grade}</td>
                  <td>{record.remarks}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(record)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(record.id)}
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
              <h3>{selectedGrade ? "Edit Grade" : "Add Grade"}</h3>
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
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>

                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  name="grade"
                  placeholder="Grade"
                  value={formData.grade}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="remarks"
                  placeholder="Remarks (e.g. Passed)"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>

              <button className="submit-btn" type="submit">
                {selectedGrade ? "Update Grade" : "Add Grade"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Grades;