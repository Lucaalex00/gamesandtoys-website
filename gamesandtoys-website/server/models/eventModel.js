import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  img: { type: String, required: true },
  desc: { type: String, required: true },
});

const Event = mongoose.model("Event", eventSchema, "events");

export default Event;
