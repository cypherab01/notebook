import { models, Schema, model } from "mongoose";

const noteSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Note = models.Note || model("Note", noteSchema);

export default Note;