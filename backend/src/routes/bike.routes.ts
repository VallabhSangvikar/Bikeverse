import { Router } from "express";
import { BikeController } from "../controllers/bike.controller";
import { authMiddleware, roleCheck } from "../middleware/auth.middleware";

const router = Router();
const bikeController = new BikeController();

// Public routes (accessible to all users)
router.get("/seller",authMiddleware, roleCheck(["seller"]), bikeController.getBySeller.bind(bikeController));
router.get("/search", bikeController.search.bind(bikeController));
router.get("/:id", bikeController.getById.bind(bikeController));
router.get("/", bikeController.getAll.bind(bikeController)); // Get all bikes

// Protected routes (only authenticated users)
router.use(authMiddleware);

// Seller routes (only sellers can create, update, and delete bikes)
router.post("/", roleCheck(["seller"]), bikeController.create.bind(bikeController));
router.put("/:id", roleCheck(["seller"]), bikeController.update.bind(bikeController));
router.delete("/:id", roleCheck(["seller"]), bikeController.delete.bind(bikeController));

export default router;
