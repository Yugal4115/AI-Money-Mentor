const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const testUser = {
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        };

        const existing = await User.findOne({ email: testUser.email });
        if (existing) {
            console.log("User already exists");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(testUser.password, salt);
            await User.create({ ...testUser, password: hashed });
            console.log("User seeded: test@example.com / password123");
        }
    } catch (err) {
        console.error("Seeding Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
