import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Student form data
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    branch: "",
    year: "",
    email: ""
  });

  // Store all students
  const [students, setStudents] = useState([]);

  // Student currently being edited
  const [editingId, setEditingId] = useState(null);

  // Success / error message
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Branch filter
  const [branchFilter, setBranchFilter] = useState("all");

  // Year filter
  const [yearFilter, setYearFilter] = useState("all");

  // Fetch students when page loads
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.log("Error fetching students:", error);

        setMessage("Unable to connect to the server.");
        setMessageType("error");
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent({
      ...student,
      [name]: value
    });

    setMessage("");
    setMessageType("");
  };

  // Reset form
  const resetForm = () => {
    setStudent({
      name: "",
      rollNo: "",
      branch: "",
      year: "",
      email: ""
    });

    setEditingId(null);
  };

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Remove extra spaces
    const trimmedStudent = {
      name: student.name.trim(),
      rollNo: student.rollNo.trim(),
      branch: student.branch.trim(),
      year: student.year,
      email: student.email.trim()
    };

    // Check empty / spaces-only fields
    if (
      !trimmedStudent.name ||
      !trimmedStudent.rollNo ||
      !trimmedStudent.branch ||
      !trimmedStudent.year ||
      !trimmedStudent.email
    ) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(trimmedStudent)
      });

      const data = await response.json();

      if (response.ok) {
        setStudents([...students, data]);

        setMessage("Student added successfully!");
        setMessageType("success");

        resetForm();
      } else {
        setMessage(data.message || "Unable to add student.");
        setMessageType("error");
      }
    } catch (error) {
      console.log("Server error:", error);

      setMessage("Unable to connect to the server.");
      setMessageType("error");
    }
  };

  // Start editing
  const handleEdit = (student) => {
    setStudent({
      name: student.name,
      rollNo: student.rollNo,
      branch: student.branch,
      year: student.year,
      email: student.email
    });

    setEditingId(student._id);

    setMessage("");
    setMessageType("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Update student
  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Remove extra spaces
    const trimmedStudent = {
      name: student.name.trim(),
      rollNo: student.rollNo.trim(),
      branch: student.branch.trim(),
      year: student.year,
      email: student.email.trim()
    };

    // Check empty / spaces-only fields
    if (
      !trimmedStudent.name ||
      !trimmedStudent.rollNo ||
      !trimmedStudent.branch ||
      !trimmedStudent.year ||
      !trimmedStudent.email
    ) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/students/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(trimmedStudent)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudents(
          students.map((item) =>
            item._id === editingId ? data : item
          )
        );

        setMessage("Student updated successfully!");
        setMessageType("success");

        resetForm();
      } else {
        setMessage(data.message || "Unable to update student.");
        setMessageType("error");
      }
    } catch (error) {
      console.log("Server error:", error);

      setMessage("Unable to connect to the server.");
      setMessageType("error");
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `http://localhost:5000/students/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudents(
          students.filter((student) => student._id !== id)
        );

        setMessage("Student deleted successfully!");
        setMessageType("success");

        if (editingId === id) {
          resetForm();
        }
      } else {
        setMessage(data.message || "Unable to delete student.");
        setMessageType("error");
      }
    } catch (error) {
      console.log("Server error:", error);

      setMessage("Unable to connect to the server.");
      setMessageType("error");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    resetForm();

    setMessage("");
    setMessageType("");
  };

  // Get unique branches
  const branches = [
    ...new Set(
      students
        .map((student) => student.branch)
        .filter((branch) => branch)
    )
  ];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      student.rollNo.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.branch.toLowerCase().includes(searchText);

    const matchesBranch =
      branchFilter === "all" ||
      student.branch.toLowerCase() === branchFilter.toLowerCase();

    const matchesYear =
      yearFilter === "all" ||
      String(student.year) === yearFilter;

    return matchesSearch && matchesBranch && matchesYear;
  });

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1 className="title">Student Management System</h1>
          <p>Manage student information easily</p>
        </div>
      </header>

      <main className="container">

        {/* Message */}
        {message && (
          <div className={`message ${messageType}`}>
            <span>
              {messageType === "success" ? "✓" : "!"}
            </span>

            {message}
          </div>
        )}

        {/* Dashboard Stats */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon">👨‍🎓</div>

            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔍</div>

            <div>
              <p>Showing</p>
              <h2>{filteredStudents.length}</h2>
            </div>
          </div>

        </section>

        {/* Student Form */}
        <section className="form-card">

          <div className="section-title">
            <div>
              <h2>
                {editingId ? "Edit Student" : "Add New Student"}
              </h2>

              <p>
                {editingId
                  ? "Update the student's information"
                  : "Enter student details below"}
              </p>
            </div>
          </div>

          <form
            onSubmit={editingId ? handleUpdate : handleSubmit}
          >

            <div className="form-grid">

              {/* Name */}
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={student.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Roll Number */}
              <div className="form-group">
                <label>Roll Number</label>

                <input
                  type="text"
                  name="rollNo"
                  placeholder="Enter roll number"
                  value={student.rollNo}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Branch */}
              <div className="form-group">
                <label>Branch</label>

                <input
                  type="text"
                  name="branch"
                  placeholder="Enter branch"
                  value={student.branch}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Year */}
              <div className="form-group">
                <label>Year</label>

                <input
                  type="number"
                  name="year"
                  placeholder="Enter year"
                  min="1"
                  max="4"
                  value={student.year}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group full-width">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={student.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Form Buttons */}
            <div className="form-buttons">

              <button
                type="submit"
                className="primary-button"
              >
                {editingId ? "Update Student" : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {/* Students Section */}
        <section className="students-section">

          <div className="students-header">

            <div>
              <h2>Students</h2>

              <p>
                {students.length} student
                {students.length !== 1 ? "s" : ""} registered
              </p>
            </div>

            {/* Search and Filters */}
            <div className="student-filters">

              {/* Search */}
              <div className="search-box">

                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              {/* Branch Filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="all">
                  All Branches
                </option>

                {branches.map((branch) => (
                  <option
                    key={branch}
                    value={branch}
                  >
                    {branch}
                  </option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">
                  All Years
                </option>

                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>

            </div>

          </div>

          {/* Students */}
          {filteredStudents.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">📚</div>

              <h3>
                {students.length === 0
                  ? "No students found"
                  : "No matching students"}
              </h3>

              <p>
                {students.length === 0
                  ? "Add your first student using the form above."
                  : "Try changing your search or filters."}
              </p>

            </div>

          ) : (

            <div className="student-grid">

              {filteredStudents.map((student) => (

                <div
                  className="student-card"
                  key={student._id}
                >

                  {/* Student top */}
                  <div className="student-top">

                    <div className="student-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="student-name">
                      <h3>{student.name}</h3>

                      <span>
                        {student.rollNo}
                      </span>
                    </div>

                  </div>

                  {/* Student details */}
                  <div className="student-details">

                    <div className="detail">
                      <span className="detail-label">
                        Branch
                      </span>

                      <strong>
                        {student.branch}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Year
                      </span>

                      <strong>
                        Year {student.year}
                      </strong>
                    </div>

                    <div className="detail full-detail">
                      <span className="detail-label">
                        Email
                      </span>

                      <strong>
                        {student.email}
                      </strong>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="student-actions">

                    <button
                      className="edit-button"
                      onClick={() => handleEdit(student)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(student._id)}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* Footer */}
      <footer>
        <p>Student Management System • MERN Stack</p>
      </footer>

    </div>
  );
}

export default App;