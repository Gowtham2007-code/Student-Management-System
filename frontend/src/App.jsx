import { useEffect, useState } from "react";

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

  // Store the ID of the student being edited
  const [editingId, setEditingId] = useState(null);

  // Fetch students when the page loads
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.log("Error fetching students:", error);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent({
      ...student,
      [name]: value
    });
  };

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Student added:", data);

        // Add new student to the list
        setStudents([...students, data]);

        // Clear form
        setStudent({
          name: "",
          rollNo: "",
          branch: "",
          year: "",
          email: ""
        });
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.log("Server error:", error.message);
    }
  };

  // Start editing a student
  const handleEdit = (student) => {
    setStudent({
      name: student.name,
      rollNo: student.rollNo,
      branch: student.branch,
      year: student.year,
      email: student.email
    });

    setEditingId(student._id);
  };

  // Update student
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/students/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(student)
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Student updated:", data);

        // Update student in frontend list
        setStudents(
          students.map((item) =>
            item._id === editingId ? data : item
          )
        );

        // Clear form
        setStudent({
          name: "",
          rollNo: "",
          branch: "",
          year: "",
          email: ""
        });

        // Exit edit mode
        setEditingId(null);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.log("Server error:", error.message);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/students/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Student deleted:", data);

        // Remove deleted student from frontend list
        setStudents(
          students.filter((student) => student._id !== id)
        );
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.log("Server error:", error.message);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setStudent({
      name: "",
      rollNo: "",
      branch: "",
      year: "",
      email: ""
    });

    setEditingId(null);
  };

  return (
    <div>
      <h1>Student Management System</h1>

      {/* Student Form */}
      <form
        onSubmit={editingId ? handleUpdate : handleSubmit}
      >
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Roll No</label>
          <input
            type="text"
            name="rollNo"
            value={student.rollNo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Branch</label>
          <input
            type="text"
            name="branch"
            value={student.branch}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={student.year}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
          />
        </div>

        {/* Form Button */}
        {editingId ? (
          <div>
            <button type="submit">
              Update Student
            </button>

            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button type="submit">
            Add Student
          </button>
        )}
      </form>

      {/* Students List */}
      <h2>Students List</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div key={student._id}>
            <p>Name: {student.name}</p>

            <p>Roll No: {student.rollNo}</p>

            <p>Branch: {student.branch}</p>

            <p>Year: {student.year}</p>

            <p>Email: {student.email}</p>

            {/* Edit Button */}
            <button
              onClick={() => handleEdit(student)}
            >
              Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(student._id)}
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;