import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  img: { type: String, required: true },
  desc: { type: String, required: true },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      points: { type: Number, default: 0 },
    },
  ],
});

const Event = mongoose.model("Event", eventSchema, "events");

export default Event;
