import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authMiddleware, roleCheck } from "../middleware/auth.middleware";

const router = Router();
const reviewController = new ReviewController();


router.get("/my-reviews",authMiddleware, reviewController.getAllMyReviews.bind(reviewController));
router.get("/:bikeid", reviewController.getBikeReviews.bind(reviewController));

router.use(authMiddleware);

// Protected routes - specific paths first
router.post("/", reviewController.createReview.bind(reviewController));
router.put("/:id", reviewController.updateReview.bind(reviewController));

// Public routes with parameters last

export default router;

