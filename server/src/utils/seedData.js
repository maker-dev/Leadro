import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    const hashedPassword = await bcrypt.hash('123456', 10);

    await User.create({
      name: 'Anas Draiaf',
      email: 'anas@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('User inserted successfully');
    process.exit();
  } catch (err) {
    console.error('Error inserting user:', err);
    process.exit(1);
  }
};

seedUsers();
