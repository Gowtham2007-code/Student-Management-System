import { useState } from "react";

function App() {
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    branch: "",
    year: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent({
      ...student,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(student);
  };

  return (
    <div>
      <h1>Student Management System</h1>

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
    </div>
  );
}

export default App;