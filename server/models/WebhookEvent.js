import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },

    event: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "processed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

const WebhookEvent = mongoose.model(
  "WebhookEvent",
  webhookEventSchema
);

export default WebhookEvent;