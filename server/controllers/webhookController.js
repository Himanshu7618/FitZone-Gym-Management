import crypto from "crypto";
import WebhookEvent from "../models/WebhookEvent.js";
import MembershipPlan from "../models/MembershipPlan.js";
import Membership from "../models/Membership.js";
import razorpay from "../config/razorpay.js";

export const handleRazorpayWebhook = async (req, res) => {
  let eventId;

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook secret or signature",
      });
    }

    // 1. Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    // 2. Parse event
    const event = JSON.parse(req.body.toString());

    eventId = req.headers["x-razorpay-event-id"];

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook event ID",
      });
    }

    // 3. Check duplicate event
    let existingEvent = await WebhookEvent.findOne({ eventId });

    if (existingEvent?.status === "processed") {
      return res.status(200).json({
        success: true,
        message: "Event already processed",
      });
    }

    if (existingEvent?.status === "processing") {
      return res.status(500).json({
        success: false,
        message: "Event is already processing",
      });
    }

    if (existingEvent?.status === "failed") {
      existingEvent.status = "processing";
      await existingEvent.save();
    } else {
      existingEvent = await WebhookEvent.create({
        eventId,
        event: event.event,
        status: "processing",
      });
    }

    // 4. Extract payment details
    const paymentEntity = event.payload?.payment?.entity;

    // 5. Handle successful payment
    if (event.event === "payment.captured" && paymentEntity) {
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const order = await razorpay.orders.fetch(orderId);

      if (
        order.status !== "paid" ||
        order.amount !== paymentEntity.amount ||
        order.currency !== paymentEntity.currency ||
        paymentEntity.status !== "captured"
      ) {
        throw new Error("Payment verification failed");
      }

      const userId = order.notes?.userId;
      const planId = order.notes?.planId;

      if (!userId || !planId) {
        throw new Error("User or plan details missing");
      }

      const plan = await MembershipPlan.findOne({
        _id: planId,
        isActive: true,
      });

      if (!plan || order.amount !== Math.round(plan.price * 100)) {
        throw new Error("Invalid membership plan or amount");
      }

      // 6. Prevent duplicate membership
      const existingMembership = await Membership.findOne({
        $or: [
          { paymentId },
          { razorpayOrderId: orderId },
        ],
      });

      if (!existingMembership) {
        const startDate = new Date();
        const endDate = new Date(startDate);

        if (plan.durationType === "days") {
          endDate.setDate(endDate.getDate() + plan.duration);
        } else if (plan.durationType === "years") {
          endDate.setFullYear(endDate.getFullYear() + plan.duration);
        } else {
          endDate.setMonth(endDate.getMonth() + plan.duration);
        }

        await Membership.create({
          user: userId,
          plan: plan._id,
          startDate,
          endDate,
          status: "active",
          paymentStatus: "paid",
          paymentMethod: "online",
          paymentId,
          razorpayOrderId: orderId,
        });

        console.log("Membership activated through webhook");
      } else {
        console.log("Membership already exists for this payment");
      }
    }

    // 7. Handle failed payment
    if (event.event === "payment.failed" && paymentEntity) {
      console.log("Payment Failed:", paymentEntity.id);
    }

    // 8. Mark event as processed
    existingEvent.status = "processed";
    await existingEvent.save();

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });

  } catch (error) {
    console.error("Webhook Error:", error.message);

    if (eventId) {
      await WebhookEvent.findOneAndUpdate(
        { eventId },
        { status: "failed" }
      );
    }

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};