import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		image: { type: String, default: null },
	},
	{ timestamps: true },
);

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);