import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({
        success: false,
        message: 'All fields are required and password must be at least 8 characters',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id.toString());

    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get current user (protected)
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all available cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, car });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Book a car
export const bookCar = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.body;

    const car = await Car.findById(carId);
    if (!car || !car.isAvailable) {
      return res.status(404).json({ success: false, message: "Car not available" });
    }

    const pricePerDay = car.pricePerDay;
    const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * pricePerDay;

    const booking = await Booking.create({
      car: car._id,
      user: req.user._id,
      owner: car.owner,
      pickupDate,
      returnDate,
      price: totalPrice
    });

    res.json({ success: true, message: "Car booked successfully", booking });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
};

// ✅ Get all bookings by the logged-in user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car");
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};
