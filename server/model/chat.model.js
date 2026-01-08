import mongoose from "mongoose";

const chatSchema  = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["success", "error"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

export const Chat =  mongoose.model("chat", chatSchema);
