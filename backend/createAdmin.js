const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const Admin = require("./models/Admin");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await Admin.findOne({
            username: "admin"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        const admin = await Admin.create({
            username: "admin",
            password: hashedPassword
        });

        console.log("Admin created successfully");
        console.log("Username: admin");
        console.log("Password: admin123");

        process.exit();

    } catch (error) {
        console.log("Error creating admin:");
        console.log(error.message);

        process.exit(1);
    }
};

createAdmin();