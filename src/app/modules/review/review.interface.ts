import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IBook } from '../book/book.interface';

export type IReview = {
  book: Types.ObjectId | IBook; // reference _id
  reviewBy: Types.ObjectId | IUser; // reference _id
  reviewText: string;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
