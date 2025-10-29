import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.model("About", aboutSchema);
