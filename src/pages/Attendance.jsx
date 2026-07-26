import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Attendance() {

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    class_id: "",
    attendance_date: "",
    status: "Present"
  });

  const fetchAttendance = () => {
    axios
      .get("http://localhost:5000/attendance")
      .then((response) => {
        setAttendance(response.data);
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
    fetchAttendance();
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
    setSelectedRecord(null);
    setFormData({ student_id: "", class_id: "", attendance_date: "", status: "Present" });
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setFormData({
      student_id: record.student_id || "",
      class_id: record.class_id || "",
      attendance_date: record.attendance_date
        ? record.attendance_date.substring(0, 10)
        : "",
      status: record.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
    setFormData({ student_id: "", class_id: "", attendance_date: "", status: "Present" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedRecord) {

        await axios.put(
          `http://localhost:5000/attendance/${selectedRecord.id}`,
          formData
        );

        alert("Attendance updated successfully");

      } else {

        await axios.post(
          "http://localhost:5000/attendance",
          formData
        );

        alert("Attendance recorded successfully");
      }

      fetchAttendance();
      closeModal();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save attendance");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(`http://localhost:5000/attendance/${id}`);

      setAttendance(attendance.filter((record) => record.id !== id));

      alert("Attendance record deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete attendance record");
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
        + Add Attendance
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {attendance
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
                  <td>{record.attendance_date ? record.attendance_date.substring(0, 10) : ""}</td>
                  <td>{record.status}</td>
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
              <h3>{selectedRecord ? "Edit Attendance" : "Add Attendance"}</h3>
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
                  type="date"
                  name="attendance_date"
                  value={formData.attendance_date}
                  onChange={handleChange}
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>

              <button className="submit-btn" type="submit">
                {selectedRecord ? "Update Attendance" : "Add Attendance"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Attendance;