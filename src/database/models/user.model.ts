import { IUserDocument } from "@/types/user.types";
import bcrypt from "bcryptjs";
import mongoose, { Model, Schema } from "mongoose";

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    avatar: {
      type: String,
      default: "",
    },
    password_hash: {
      type: String,
      select: false, // SECURITY: Never return password unless explicitly asked
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 2. Pre-save Hook: Hash the password
// Fix: Removed 'next' parameter. Mongoose supports pure async/await functions.
UserSchema.pre("save", async function () {
  if (!this.isModified("password_hash")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash!, salt);
  } catch (error) {
    // Throwing an error here will automatically stop the save process in Mongoose
    throw error;
  }
});

// 3. Instance Method: Verify Password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // If password_hash is not selected/present, we can't compare
  if (!this.password_hash) return false;
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// ---------------------------------------------------------
// Next.js Hot Reload Fix
// ---------------------------------------------------------
// In Next.js, the backend code recompiles frequently in development.
// This prevents "OverwriteModelError" by checking if the model exists first.

const UserModel: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
