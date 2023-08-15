import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import masteringRoutes from "./routes/mastering.routes";
import registrationRoutes from "./routes/registration.routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/mastering", masteringRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// function cors(): any {
//   throw new Error("Function not implemented.");
// }
