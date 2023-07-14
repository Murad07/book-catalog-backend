/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../book/book.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  const { book, buyer } = order;

  const buyerUser = await User.findById(buyer);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (buyerUser) {
      const bookData: any = await Book.findById(book).populate('seller');
      const sellerUser = await User.findById(bookData.seller);

      // Check buyer have enough budget to buy book
      if (buyerUser.budget < bookData.price) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Not enough money to buy this book'
        );
      } else if (bookData.label === 'sold out') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Not available for sell');
      } else {
        const updatedBook = await Book.findByIdAndUpdate(book, {
          label: 'sold out',
        });
        if (!updatedBook) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update book');
        }
      }

      if (sellerUser) {
        sellerUser.income += bookData.price;
        const updatedSellerUser = await sellerUser.updateOne({
          income: sellerUser.income,
        });
        if (!updatedSellerUser) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update seller');
        }
      }

      buyerUser.budget -= bookData.price;
      const updatedBuyerUser = await buyerUser.updateOne({
        budget: buyerUser.budget,
      });
      if (!updatedBuyerUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update buyer');
      }
    }

    const newOrder = await Order.create(order);
    if (!newOrder) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    await session.commitTransaction();
    await session.endSession();

    // Populate all data are updated
    const orderData = await Order.findById(newOrder.id)
      .populate('book')
      .populate('buyer')
      .populate({
        path: 'book',
        populate: {
          path: 'seller',
        },
      });

    return orderData;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getAllOrders = async (
  paginationOptions: IPaginationOptions,
  userId: string,
  userRole: string
): Promise<IGenericResponse<IOrder[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  let query = Order.find();
  let countQuery = Order.countDocuments();

  let result: any = [];
  let total = 0;

  if (userRole === 'buyer') {
    query = query.where('buyer', userId);
    countQuery = countQuery.where('buyer', userId);

    result = await query
      .populate('book')
      .populate('buyer')
      .populate({
        path: 'book',
        populate: {
          path: 'seller',
        },
      })
      .skip(skip)
      .limit(limit);

    total = await countQuery;
    if (total === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No Order found !');
    }
  } else if (userRole === 'seller') {
    const books = await Book.find({ seller: userId });

    if (books.length > 0) {
      let orders: any = [];

      // Fetch orders for each book
      for (const book of books) {
        const bookOrders = await Order.find({ book: book._id })
          .populate('book')
          .populate('buyer')
          .populate({
            path: 'book',
            populate: {
              path: 'seller',
            },
          });
        orders = orders.concat(bookOrders);
      }

      result = orders;
      total = orders.length;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'No Order found !');
    }
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate('book')
    .populate('buyer')
    .populate({
      path: 'book',
      populate: {
        path: 'seller',
      },
    });
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
