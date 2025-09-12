import express from "express";
import {
  getCars,
  getCarById,
  getUserData,
  loginUser,
  registerUser,
  bookCar,
  getMyBookings
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

// Auth Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected User Data
userRouter.get("/data", protect, getUserData);

// Car Routes
userRouter.get("/cars", getCars);
userRouter.get("/car/:id", getCarById);
userRouter.post("/book-car", protect, bookCar);

// ✅ My Bookings Route
userRouter.get("/my-booking/user", protect, getMyBookings);

export default userRouter;
