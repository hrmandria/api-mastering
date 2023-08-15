import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

export interface Mastering {
  user: User;
  name: string;
  createdAt: Date;
}

const masteringSchema = new Schema<Mastering>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export const MasteringModel = mongoose.model("Masterings", masteringSchema);
