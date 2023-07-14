/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  const { cow, buyer } = order;

  const buyerUser = await User.findById(buyer);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (buyerUser) {
      const cowData: any = await Cow.findById(cow).populate('seller');
      const sellerUser = await User.findById(cowData.seller);

      // Check buyer have enough budget to buy cow
      if (buyerUser.budget < cowData.price) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Not enough money to buy this cow'
        );
      } else if (cowData.label === 'sold out') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Not available for sell');
      } else {
        const updatedCow = await Cow.findByIdAndUpdate(cow, {
          label: 'sold out',
        });
        if (!updatedCow) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update cow');
        }
      }

      if (sellerUser) {
        sellerUser.income += cowData.price;
        const updatedSellerUser = await sellerUser.updateOne({
          income: sellerUser.income,
        });
        if (!updatedSellerUser) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update seller');
        }
      }

      buyerUser.budget -= cowData.price;
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
      .populate('cow')
      .populate('buyer')
      .populate({
        path: 'cow',
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
      .populate('cow')
      .populate('buyer')
      .populate({
        path: 'cow',
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
    const cows = await Cow.find({ seller: userId });

    if (cows.length > 0) {
      let orders: any = [];

      // Fetch orders for each cow
      for (const cow of cows) {
        const cowOrders = await Order.find({ cow: cow._id })
          .populate('cow')
          .populate('buyer')
          .populate({
            path: 'cow',
            populate: {
              path: 'seller',
            },
          });
        orders = orders.concat(cowOrders);
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
    .populate('cow')
    .populate('buyer')
    .populate({
      path: 'cow',
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
