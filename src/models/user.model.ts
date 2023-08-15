import mongoose from "mongoose";
import { Mastering } from "./mastering.model";

export interface User {
  email: string;
  password: string;
  masterings: Mastering[];
}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  masterings: [
    {
      type: mongoose.Types.ObjectId,
      ref: "masterings",
      default: [],
    },
  ],
});

export default mongoose.model("User", userSchema);
