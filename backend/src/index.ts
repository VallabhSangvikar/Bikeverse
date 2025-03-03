import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.middleware";
import postRoutes from "./routes/posts"; 
import bikeRoutes from "./routes/bike.routes"; 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("BikeVerse API");
});

import routes from "./routes";
app.use("/api", routes);

// Add post routes
app.use("/api/posts", postRoutes);

// Add bike routes
app.use("/api/bikes", bikeRoutes); // <-- Added bike routes

// Error handling
app.use(errorMiddleware);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bikeverse")
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
