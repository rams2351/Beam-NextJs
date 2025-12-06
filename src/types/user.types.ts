import { Document } from "mongoose";

// 1. The Shape of the User Data (Frontend Friendly)
export interface IUser {
  _id: string; // MongoDB ID is always a string on the frontend
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

// 2. The Shape of the User Document (Backend / Mongoose only)
// Extends Mongoose 'Document' to include methods like .save(), .remove()
export interface IUserDocument extends Document, Omit<IUser, "_id"> {
  password_hash: string;

  // Method to check password (if you add authentication logic later)
  comparePassword(candidatePassword: string): Promise<boolean>;
}
