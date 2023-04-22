import mongoose, { Document, Model } from 'mongoose'

export enum UserRoles {
  Standard,
  Admin,
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: UserRoles;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: UserRoles.Standard }
  },
  { timestamps: true }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema)

export default User
