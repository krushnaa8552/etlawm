import crypto from "crypto";
import razorpay from "../services/razorpayService.js";
import db from "../pgdb.js";

const createRazorpayOrder = async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({
      success: false,
      message: "order_id is required.",
    });
  }

  try {
    const { rows } = await db.orders.findById(order_id);
    const order = rows[0];

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      // Razorpay expects the smallest currency unit.
      // ₹500 becomes 50000 paise.
      amount: Math.round(Number(order.total_amount) * 100),
      currency: "INR",
      receipt: `order_${order.id}`,
      notes: {
        database_order_id: order.id,
        user_id: req.user.id,
      },
    });

    await db.orders.setRazorpayOrderId(
      order.id,
      razorpayOrder.id,
    );

    return res.status(201).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpay_order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (err) {
    console.error("[create Razorpay order]", err);

    return res.status(500).json({
      success: false,
      message: "Could not create payment order.",
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  const {
    order_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !order_id ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment verification details are required.",
    });
  }

  try {
    const { rows } = await db.orders.findById(order_id);
    const order = rows[0];

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (order.razorpay_order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID does not match.",
      });
    }

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET,
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`,
      )
      .digest("hex");

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "utf8",
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8",
    );

    const isValid =
      receivedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer,
      );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    const {
      rows: [updatedOrder],
    } = await db.orders.markPaid({
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("[verify Razorpay payment]", err);

    return res.status(500).json({
      success: false,
      message: "Could not verify payment.",
    });
  }
};

export {
  createRazorpayOrder,
  verifyRazorpayPayment,
};