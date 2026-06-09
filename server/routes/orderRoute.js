import express from "express";

import {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  requireAuth,
  requireAdmin,
} from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/", requireAuth, placeOrder);

orderRouter.get("/", requireAuth, getUserOrders);

orderRouter.get("/:id", requireAuth, getOrderById);

orderRouter.patch(
  "/:id/status",
  requireAdmin,
  updateOrderStatus,
);

export default orderRouter;