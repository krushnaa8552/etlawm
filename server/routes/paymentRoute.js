import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/razorpay/order", requireAuth, createRazorpayOrder);

paymentRouter.post("/razorpay/verify", requireAuth, verifyRazorpayPayment);

export default paymentRouter;