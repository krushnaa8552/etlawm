import express from "express";

import { upsertReview, getProductReviews, deleteReview } from "../controllers/reviewController.js";

import { requireAuth } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/", requireAuth, upsertReview);

reviewRouter.get("/product/:product_id", getProductReviews );

reviewRouter.delete("/product/:product_id", requireAuth, deleteReview);

export default reviewRouter;