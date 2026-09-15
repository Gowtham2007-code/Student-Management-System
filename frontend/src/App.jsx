import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [student, setStudent] = useState({
        name: "",
        rollNo: "",
        branch: "",
        year: "",
        email: "",
    });

    const [students, setStudents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [errors, setErrors] = useState({});

    const [search, setSearch] = useState("");
    const [branchFilter, setBranchFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");

    const [loadingStudents, setLoadingStudents] = useState(true);
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 6;

    // Fetch all students
    const fetchStudents = async () => {
        try {
            setLoadingStudents(true);

            const response = await fetch("http://localhost:5000/students");

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();

            setStudents(data);
        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Reset pagination when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, branchFilter, yearFilter]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setStudent({
            ...student,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: "",
        });
    };

    // Validate form
    const validateStudent = () => {
        const newErrors = {};

        // Name validation
        if (!student.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z ]+$/.test(student.name.trim())) {
            newErrors.name = "Name should contain only letters";
        }

        // Roll number validation
        if (!student.rollNo.trim()) {
            newErrors.rollNo = "Roll number is required";
        } else if (
            !/^\d{2}[A-Za-z]\d{2}[A-Za-z]\d{4}$/.test(
                student.rollNo.trim()
            )
        ) {
            newErrors.rollNo =
                "Enter a valid roll number (example: 24A81A4341)";
        }

        // Branch validation
        if (!student.branch.trim()) {
            newErrors.branch = "Branch is required";
        }

        // Year validation
        if (!student.year) {
            newErrors.year = "Year is required";
        } else if (
            Number(student.year) < 1 ||
            Number(student.year) > 4
        ) {
            newErrors.year = "Year must be between 1 and 4";
        }

        // Email validation
        if (!student.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                student.email.trim()
            )
        ) {
            newErrors.email = "Enter a valid email address";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Add student
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (!validateStudent()) {
            return;
        }

        try {
            setAdding(true);

            const studentData = {
                name: student.name.trim(),
                rollNo: student.rollNo.trim(),
                branch: student.branch.trim(),
                year: Number(student.year),
                email: student.email.trim().toLowerCase(),
            };

            const response = await fetch(
                "http://localhost:5000/students",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(studentData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add student"
                );
            }

            setStudents((prev) => [...prev, data]);

            setStudent({
                name: "",
                rollNo: "",
                branch: "",
                year: "",
                email: "",
            });

            setErrors({});

            setMessage("Student added successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        } finally {
            setAdding(false);
        }
    };

    // View student details
    const handleViewDetails = (studentData) => {
        setSelectedStudent(studentData);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Close student details
    const handleCloseDetails = () => {
        setSelectedStudent(null);
    };

    // Start editing
    const handleEdit = (studentData) => {
        setSelectedStudent(null);

        setStudent({
            name: studentData.name,
            rollNo: studentData.rollNo,
            branch: studentData.branch,
            year: studentData.year,
            email: studentData.email,
        });

        setEditingId(studentData._id);

        setErrors({});

        setMessage("");
        setMessageType("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Update student
    const handleUpdate = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (!validateStudent()) {
            return;
        }

        try {
            setUpdating(true);

            const studentData = {
                name: student.name.trim(),
                rollNo: student.rollNo.trim(),
                branch: student.branch.trim(),
                year: Number(student.year),
                email: student.email.trim().toLowerCase(),
            };

            const response = await fetch(
                `http://localhost:5000/students/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(studentData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update student"
                );
            }

            setStudents((prev) =>
                prev.map((item) =>
                    item._id === editingId ? data : item
                )
            );

            setSelectedStudent(data);

            setStudent({
                name: "",
                rollNo: "",
                branch: "",
                year: "",
                email: "",
            });

            setEditingId(null);
            setErrors({});

            setMessage("Student updated successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        } finally {
            setUpdating(false);
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

        try {
            setDeletingId(id);

            const response = await fetch(
                `http://localhost:5000/students/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete student"
                );
            }

            setStudents((prev) =>
                prev.filter((item) => item._id !== id)
            );

            if (selectedStudent?._id === id) {
                setSelectedStudent(null);
            }

            setMessage("Student deleted successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        } finally {
            setDeletingId(null);
        }
    };

    // Cancel edit
    const handleCancel = () => {
        setStudent({
            name: "",
            rollNo: "",
            branch: "",
            year: "",
            email: "",
        });

        setEditingId(null);
        setErrors({});
        setMessage("");
        setMessageType("");
    };

    // Get unique branches
    const branches = [
        ...new Set(
            students
                .map((item) => item.branch)
                .filter(Boolean)
        ),
    ];

    // Filter students
    const filteredStudents = students.filter((studentData) => {
        const searchText = search.toLowerCase().trim();

        const matchesSearch =
            studentData.name
                ?.toLowerCase()
                .includes(searchText) ||
            studentData.rollNo
                ?.toLowerCase()
                .includes(searchText) ||
            studentData.email
                ?.toLowerCase()
                .includes(searchText) ||
            studentData.branch
                ?.toLowerCase()
                .includes(searchText);

        const matchesBranch =
            branchFilter === "all" ||
            studentData.branch === branchFilter;

        const matchesYear =
            yearFilter === "all" ||
            String(studentData.year) === yearFilter;

        return (
            matchesSearch &&
            matchesBranch &&
            matchesYear
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(
        filteredStudents.length / studentsPerPage
    );

    const startIndex =
        (currentPage - 1) * studentsPerPage;

    const currentStudents = filteredStudents.slice(
        startIndex,
        startIndex + studentsPerPage
    );

    // Keep page valid after deleting students
    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="app">

            {/* Header */}
            <header className="header">
                <div className="container">
                    <h1 className="title">Student Management System</h1>

                    <p>
                        Manage student records easily and efficiently
                    </p>
                </div>
            </header>

            <main className="container">

                {/* Message */}
                {message && (
                    <div
                        className={`message ${
                            messageType === "success"
                                ? "success"
                                : "error"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Student Details */}
                {selectedStudent ? (
                    <section className="details-card">

                        <div className="details-header">
                            <button
                                className="back-button"
                                onClick={handleCloseDetails}
                            >
                                ← Back to Students
                            </button>
                        </div>

                        <div className="profile-section">

                            <div className="profile-avatar">
                                {selectedStudent.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <h2>
                                    {selectedStudent.name}
                                </h2>

                                <p>
                                    Student Profile
                                </p>
                            </div>

                        </div>

                        <div className="details-grid">

                            <div className="detail-box">
                                <span>Roll Number</span>
                                <strong>
                                    {selectedStudent.rollNo}
                                </strong>
                            </div>

                            <div className="detail-box">
                                <span>Branch</span>
                                <strong>
                                    {selectedStudent.branch}
                                </strong>
                            </div>

                            <div className="detail-box">
                                <span>Year</span>
                                <strong>
                                    {selectedStudent.year}
                                    {selectedStudent.year === 1
                                        ? "st"
                                        : selectedStudent.year === 2
                                        ? "nd"
                                        : selectedStudent.year === 3
                                        ? "rd"
                                        : "th"}{" "}
                                    Year
                                </strong>
                            </div>

                            <div className="detail-box">
                                <span>Email</span>
                                <strong>
                                    {selectedStudent.email}
                                </strong>
                            </div>

                        </div>

                        <div className="details-actions">

                            <button
                                className="edit-button"
                                onClick={() =>
                                    handleEdit(selectedStudent)
                                }
                            >
                                Edit Student
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    handleDelete(
                                        selectedStudent._id
                                    )
                                }
                                disabled={
                                    deletingId ===
                                    selectedStudent._id
                                }
                            >
                                {deletingId ===
                                selectedStudent._id
                                    ? "Deleting..."
                                    : "Delete Student"}
                            </button>

                        </div>

                    </section>
                ) : (
                    <>
                        {/* Statistics */}
                        <section className="stats">

                            <div className="stat-card">
                                <span>Total Students</span>
                                <strong>
                                    {students.length}
                                </strong>
                            </div>

                            <div className="stat-card">
                                <span>Branches</span>
                                <strong>
                                    {branches.length}
                                </strong>
                            </div>

                            <div className="stat-card">
                                <span>Filtered Results</span>
                                <strong>
                                    {filteredStudents.length}
                                </strong>
                            </div>

                        </section>

                        {/* Add / Edit Form */}
                        <section className="form-card">

                            <div className="section-title">
                                <div>
                                    <h2>
                                        {editingId
                                            ? "Edit Student"
                                            : "Add New Student"}
                                    </h2>

                                    <p>
                                        {editingId
                                            ? "Update student information"
                                            : "Enter student details below"}
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={
                                    editingId
                                        ? handleUpdate
                                        : handleSubmit
                                }
                            >

                                <div className="form-grid">

                                    {/* Name */}
                                    <div className="form-group">

                                        <label htmlFor="name">
                                            Full Name
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter full name"
                                            value={student.name}
                                            onChange={handleChange}
                                            disabled={
                                                adding ||
                                                updating
                                            }
                                        />

                                        {errors.name && (
                                            <span className="field-error">
                                                {errors.name}
                                            </span>
                                        )}

                                    </div>

                                    {/* Roll Number */}
                                    <div className="form-group">

                                        <label htmlFor="rollNo">
                                            Roll Number
                                        </label>

                                        <input
                                            id="rollNo"
                                            type="text"
                                            name="rollNo"
                                            placeholder="Example: 24A81A4341"
                                            value={student.rollNo}
                                            onChange={handleChange}
                                            disabled={
                                                adding ||
                                                updating
                                            }
                                        />

                                        {errors.rollNo && (
                                            <span className="field-error">
                                                {errors.rollNo}
                                            </span>
                                        )}

                                    </div>

                                    {/* Branch */}
                                    <div className="form-group">

                                        <label htmlFor="branch">
                                            Branch
                                        </label>

                                        <input
                                            id="branch"
                                            type="text"
                                            name="branch"
                                            placeholder="Example: CAI"
                                            value={student.branch}
                                            onChange={handleChange}
                                            disabled={
                                                adding ||
                                                updating
                                            }
                                        />

                                        {errors.branch && (
                                            <span className="field-error">
                                                {errors.branch}
                                            </span>
                                        )}

                                    </div>

                                    {/* Year */}
                                    <div className="form-group">

                                        <label htmlFor="year">
                                            Year
                                        </label>

                                        <select
                                            id="year"
                                            name="year"
                                            value={student.year}
                                            onChange={handleChange}
                                            disabled={
                                                adding ||
                                                updating
                                            }
                                        >
                                            <option value="">
                                                Select Year
                                            </option>

                                            <option value="1">
                                                1st Year
                                            </option>

                                            <option value="2">
                                                2nd Year
                                            </option>

                                            <option value="3">
                                                3rd Year
                                            </option>

                                            <option value="4">
                                                4th Year
                                            </option>
                                        </select>

                                        {errors.year && (
                                            <span className="field-error">
                                                {errors.year}
                                            </span>
                                        )}

                                    </div>

                                    {/* Email */}
                                    <div className="form-group">

                                        <label htmlFor="email">
                                            Email
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Enter email address"
                                            value={student.email}
                                            onChange={handleChange}
                                            disabled={
                                                adding ||
                                                updating
                                            }
                                        />

                                        {errors.email && (
                                            <span className="field-error">
                                                {errors.email}
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={
                                            adding ||
                                            updating
                                        }
                                    >
                                        {editingId
                                            ? updating
                                                ? "Updating..."
                                                : "Update Student"
                                            : adding
                                            ? "Adding..."
                                            : "Add Student"}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={updating}
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
                                        View and manage all student
                                        records
                                    </p>
                                </div>

                                <div className="student-filters">

                                    {/* Search */}
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search students..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                    />

                                    {/* Branch Filter */}
                                    <select
                                        value={branchFilter}
                                        onChange={(e) =>
                                            setBranchFilter(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="all">
                                            All Branches
                                        </option>

                                        {branches.map(
                                            (branch) => (
                                                <option
                                                    key={branch}
                                                    value={branch}
                                                >
                                                    {branch}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {/* Year Filter */}
                                    <select
                                        value={yearFilter}
                                        onChange={(e) =>
                                            setYearFilter(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="all">
                                            All Years
                                        </option>

                                        <option value="1">
                                            1st Year
                                        </option>

                                        <option value="2">
                                            2nd Year
                                        </option>

                                        <option value="3">
                                            3rd Year
                                        </option>

                                        <option value="4">
                                            4th Year
                                        </option>
                                    </select>

                                </div>

                            </div>

                            {/* Loading */}
                            {loadingStudents ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>

                                    <p>
                                        Loading students...
                                    </p>
                                </div>
                            ) : currentStudents.length > 0 ? (
                                <>
                                    {/* Student Cards */}
                                    <div className="student-grid">

                                        {currentStudents.map(
                                            (studentData) => (
                                                <div
                                                    className="student-card"
                                                    key={
                                                        studentData._id
                                                    }
                                                >

                                                    <div className="student-avatar">
                                                        {studentData.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="student-info">

                                                        <h3>
                                                            {
                                                                studentData.name
                                                            }
                                                        </h3>

                                                        <p>
                                                            {
                                                                studentData.rollNo
                                                            }
                                                        </p>

                                                        <p>
                                                            {
                                                                studentData.branch
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                studentData.year
                                                            }
                                                            {studentData.year ===
                                                            1
                                                                ? "st"
                                                                : studentData.year ===
                                                                  2
                                                                ? "nd"
                                                                : studentData.year ===
                                                                  3
                                                                ? "rd"
                                                                : "th"}{" "}
                                                            Year
                                                        </p>

                                                        <p>
                                                            {
                                                                studentData.email
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="student-actions">

                                                        <button
                                                            className="view-button"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    studentData
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    studentData
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    studentData._id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                studentData._id
                                                            }
                                                        >
                                                            {deletingId ===
                                                            studentData._id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="pagination">

                                            <button
                                                className="pagination-button"
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (prev) =>
                                                            prev -
                                                            1
                                                    )
                                                }
                                                disabled={
                                                    currentPage ===
                                                    1
                                                }
                                            >
                                                ← Previous
                                            </button>

                                            <span className="page-info">
                                                Page{" "}
                                                <strong>
                                                    {currentPage}
                                                </strong>{" "}
                                                of{" "}
                                                <strong>
                                                    {totalPages}
                                                </strong>
                                            </span>

                                            <button
                                                className="pagination-button"
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (prev) =>
                                                            prev +
                                                            1
                                                    )
                                                }
                                                disabled={
                                                    currentPage ===
                                                    totalPages
                                                }
                                            >
                                                Next →
                                            </button>

                                        </div>
                                    )}

                                </>
                            ) : (
                                <div className="empty-state">

                                    <h3>
                                        No students found
                                    </h3>

                                    <p>
                                        Try changing your search or
                                        filters, or add a new student.
                                    </p>

                                </div>
                            )}

                        </section>

                    </>
                )}

            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>
                        Student Management System • MERN Stack
                    </p>
                </div>
            </footer>

        </div>
    );
}

export default App;