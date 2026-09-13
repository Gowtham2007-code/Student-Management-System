const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        rollNo: {
            type: String,
            required: [true, "Roll number is required"],
            unique: true,
            trim: true
        },

        branch: {
            type: String,
            required: [true, "Branch is required"],
            trim: true
        },

        year: {
            type: Number,
            required: [true, "Year is required"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);