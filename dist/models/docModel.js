import mongoose from "mongoose";
import { User } from "./userModels.js";
const docSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
const Doc = mongoose.model("Doc", docSchema);
export { Doc };
