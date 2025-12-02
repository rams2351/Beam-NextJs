export interface IUser {
  _id?: string; // String is better for frontend than ObjectId
  google_id?: string;
  name: string;
  email: string;
  user_photo?: string;
  password_hash?: string; // We define it here so the Model knows about it
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
