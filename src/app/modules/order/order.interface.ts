import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IBook } from '../book/book.interface';

export type IOrder = {
  book: Types.ObjectId | IBook; // reference _id
  buyer: Types.ObjectId | IUser; // reference _id
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
