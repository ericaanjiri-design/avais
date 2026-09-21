import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    cartData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const userModel =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default userModel;