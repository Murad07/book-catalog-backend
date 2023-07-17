/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../book/book.model';
import { IReview } from './review.interface';
import { Review } from './review.model';
import ApiError from '../../../errors/ApiError';
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
  userId: string,
  userRole: string
): Promise<IGenericResponse<IReview[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  let query = Review.find();
  let countQuery = Review.countDocuments();

  let result: any = [];
  let total = 0;

  if (userRole === 'reviewBy') {
    query = query.where('reviewBy', userId);
    countQuery = countQuery.where('reviewBy', userId);

    result = await query
      .populate('book')
      .populate('reviewBy')
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
      throw new ApiError(httpStatus.NOT_FOUND, 'No Review found !');
    }
  } else if (userRole === 'seller') {
    const books = await Book.find({ seller: userId });

    if (books.length > 0) {
      let reviews: any = [];

      // Fetch reviews for each book
      for (const book of books) {
        const bookReviews = await Review.find({ book: book._id })
          .populate('book')
          .populate('reviewBy')
          .populate({
            path: 'book',
            populate: {
              path: 'seller',
            },
          });
        reviews = reviews.concat(bookReviews);
      }

      result = reviews;
      total = reviews.length;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'No Review found !');
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
