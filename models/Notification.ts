import mongoose from 'mongoose';

export interface INotification {
  _id?: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    text: {
      type: String,
      required: [true, 'Please add notification text'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
