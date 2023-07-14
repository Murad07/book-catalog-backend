import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ICow } from '../cow/cow.interface';

export type IOrder = {
  cow: Types.ObjectId | ICow; // reference _id
  buyer: Types.ObjectId | IUser; // reference _id
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
