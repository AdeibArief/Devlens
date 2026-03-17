import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  language: { type: String, default: "javascript" },
  feedback: { type: String, required: true },
  title: {
    type: String,
    default: "Untitled",
  },
},{timestamps:true});

export default mongoose.model('Review',reviewSchema);

