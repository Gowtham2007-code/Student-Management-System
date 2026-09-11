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

  return (
    <div>
      <h1>Student Management System</h1>

      {/* Student Form */}
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Add Student</button>
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

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;