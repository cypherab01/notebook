import { models, Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        name: { 
            type: String,
            required: true,
        },
        imageurl: {
            type: String,
        },
        // for future
        username: {
            type: String,
            unique: true,
            match: /^[a-zA-Z0-9]+$/,
            minlength: 3,
            maxlength: 20,
        }
    }, 
    {
        timestamps: true
    }
)

const User = models.User || model("User", userSchema);

export default User;