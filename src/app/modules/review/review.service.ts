/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { IUser } from '../user/user.interface';
import { Types } from 'mongoose';

const createReview = async (
  review: IReview,
  reviewBy: IUser | Types.ObjectId
): Promise<IReview | null> => {
  review.reviewBy = reviewBy;
  const newReview = await Review.create(review);
  return newReview;
};

const getAllReviews = async (
  paginationOptions: IPaginationOptions,
  bookId: string
): Promise<IGenericResponse<IReview[]>> => {
  const { page, limit } =
    paginationHelpers.calculatePagination(paginationOptions);

  let result: any = [];
  let total = 0;

  let reviews: any = [];

  // Fetch reviews for each book
  const bookReviews = await Review.find({ book: bookId }).populate('reviewBy');
  reviews = reviews.concat(bookReviews);

  result = reviews;
  total = reviews.length;

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleReview = async (id: string): Promise<IReview | null> => {
  const result = await Review.findById(id)
    .populate('book')
    .populate('reviewBy')
    .populate({
      path: 'book',
      populate: {
        path: 'seller',
      },
    });
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
};
