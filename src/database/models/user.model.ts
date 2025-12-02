import { IUser } from "@/types/auth"; // Import your shared, pure interface
import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Define the Mongoose-Specific Interface
// We extend the shared 'IUser' but remove '_id' to let Mongoose manage it.
// We also add 'Document' to get methods like .save(), .remove()
export interface IUserDocument extends Omit<IUser, "_id">, Document {
  // We explicitly define the methods we are adding
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    google_id: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    user_photo: { type: String },
    // 'select: false' ensures we don't accidentally send the hash to the frontend
    password_hash: { type: String, select: false },
  },
  {
    timestamps: true,
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

// Prevent model overwrite error during hot reloading
// We cast the cached model to Model<IUserDocument> to ensure TypeScript checks work
const UserModel = (mongoose.models.User as Model<IUserDocument>) || mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
