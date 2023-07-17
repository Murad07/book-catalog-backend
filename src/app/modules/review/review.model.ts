import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

export const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    reviewBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Review = model<IReview, ReviewModel>('Review', ReviewSchema);
