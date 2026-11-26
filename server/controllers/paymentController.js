import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import MembershipPlan from "../models/MembershipPlan.js";
import Membership from "../models/Membership.js";

// CREATE RAZORPAY ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await MembershipPlan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    const amount = Math.round(plan.price * 100);

    const order = await razorpay.orders.create({
  amount,
  currency: "INR",
  receipt: `membership_${Date.now()}`,
  notes: {
    userId: req.user._id.toString(),
    planId: plan._id.toString(),
  },
});

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// VERIFY PAYMENT

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    // 1. Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signatureBuffer = Buffer.from(generatedSignature, "hex");
    const receivedBuffer = Buffer.from(
      razorpay_signature || "",
      "hex"
    );

    if (
      signatureBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 2. Fetch order and payment from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // 3. Verify membership plan
    const plan = await MembershipPlan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    // 4. Verify order ownership
    if (
      order.notes?.userId !== req.user._id.toString() ||
      order.notes?.planId !== planId
    ) {
      return res.status(403).json({
        success: false,
        message: "Payment order does not belong to this user",
      });
    }

    // 5. Verify payment and order details
    if (
      order.status !== "paid" ||
      order.amount_paid !== order.amount ||
      order.currency !== "INR" ||
      order.amount !== Math.round(plan.price * 100) ||
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.amount !== order.amount ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 6. Prevent duplicate membership
    const existingMembership = await Membership.findOne({
      $or: [
        { paymentId: razorpay_payment_id },
        { razorpayOrderId: razorpay_order_id },
      ],
    });

    if (existingMembership) {
      if (
        existingMembership.user.toString() === req.user._id.toString() &&
        existingMembership.paymentId === razorpay_payment_id
      ) {
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
          membership: existingMembership,
        });
      }

      return res.status(409).json({
        success: false,
        message: "This payment order has already been used",
      });
    }

    // 7. Calculate membership expiry
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (plan.durationType === "days") {
      endDate.setDate(endDate.getDate() + plan.duration);
    } else if (plan.durationType === "years") {
      endDate.setFullYear(endDate.getFullYear() + plan.duration);
    } else {
      endDate.setMonth(endDate.getMonth() + plan.duration);
    }

    // 8. Activate membership
    const membership = await Membership.create({
      user: req.user._id,
      plan: plan._id,
      startDate,
      endDate,
      status: "active",
      paymentStatus: "paid",
      paymentMethod: "online",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment verified and membership activated",
      membership,
    });

  } catch (error) {
    console.error("Payment Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// GET MY PAYMENT HISTORY (MEMBER)

export const getMyPaymentHistory = async (req, res) => {
  try {
    const payments = await Membership.find({
      user: req.user._id,
      paymentStatus: "paid",
    })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("My Payment History Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch payment history",
    });
  }
};


// GET ALL PAYMENT HISTORY (ADMIN)

export const getAllPaymentHistory = async (req, res) => {
  try {
    const payments = await Membership.find({
      paymentStatus: "paid",
    })
      .populate("user", "name email")
      .populate("plan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("All Payment History Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch all payment history",
    });
  }
};
