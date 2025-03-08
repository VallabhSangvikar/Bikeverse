import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authMiddleware, roleCheck } from "../middleware/auth.middleware";

const router = Router();
const reviewController = new ReviewController();

// Public routes (accessible to all users)
router.get("/:bikeid", reviewController.getBikeReviews.bind(reviewController));

router.use(authMiddleware);

router.get("/myreviews", reviewController.getAllMyReviews.bind(reviewController));
router.post("/", reviewController.createReview.bind(reviewController));
router.put("/:id", reviewController.updateReview.bind(reviewController));

export default router;

