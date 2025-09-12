import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// Change role to owner
ownerRouter.put("/change-role", protect, changeRoleToOwner);

// Add a car
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);

// Get all cars of the owner
ownerRouter.get("/cars", protect, getOwnerCars);

// Toggle car availability
ownerRouter.put("/update-car-status", protect, toggleCarAvailability);

// Delete car (by ID in URL)
ownerRouter.delete("/delete-car/:carId", protect, deleteCar);

// Get owner dashboard data
ownerRouter.get("/dashboard", protect, getDashboardData);

// Update profile image
ownerRouter.post("/update-image", protect, upload.single("image"), updateUserImage);

export default ownerRouter;
