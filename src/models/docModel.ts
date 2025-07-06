import mongoose, { Date, Document, ObjectId } from "mongoose";
import { User } from "./userModels.js";

interface IDoc extends Document {
  _id: string;
  title: string;
  file: string;
  owner: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const docSchema = new mongoose.Schema<IDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      length: 50,
      index: 1,
    },
    file: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      index: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Doc = mongoose.model<IDoc>("Doc", docSchema);

export { Doc };
