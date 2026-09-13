const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Home route
app.get("/", (req, res) => {
    res.send("Student Management System API is running");
});

// CREATE - Add student
app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);

    } catch (error) {

        // Duplicate key error
        if (error.code === 11000) {

            if (error.keyPattern.email) {
                return res.status(400).json({
                    message: "Email already exists. Please use a different email."
                });
            }

            if (error.keyPattern.rollNo) {
                return res.status(400).json({
                    message: "Roll number already exists. Please use a different roll number."
                });
            }
        }

        // Mongoose validation error
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors)
                .map((err) => err.message);

            return res.status(400).json({
                message: messages.join(", ")
            });
        }

        res.status(500).json({
            message: "Server error. Please try again."
        });
    }
});

// READ - Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ - Get one student
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE - Update student
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {

        // Duplicate key error
        if (error.code === 11000) {

            if (error.keyPattern.email) {
                return res.status(400).json({
                    message: "Email already exists. Please use a different email."
                });
            }

            if (error.keyPattern.rollNo) {
                return res.status(400).json({
                    message: "Roll number already exists. Please use a different roll number."
                });
            }
        }

        // Mongoose validation error
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors)
                .map((err) => err.message);

            return res.status(400).json({
                message: messages.join(", ")
            });
        }

        res.status(500).json({
            message: "Server error. Please try again."
        });
    }
});

// DELETE - Delete student
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });