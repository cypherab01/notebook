import { models, Schema, model } from "mongoose";

const NoteSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Note = models.Note || model("Note", NoteSchema);

export default Note;