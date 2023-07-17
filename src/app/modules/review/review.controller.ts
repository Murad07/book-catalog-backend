import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IReview } from './review.interface';
import { ReviewService } from './review.service';
import { RequestHandler } from 'express-serve-static-core';

const createReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...reviewData } = req.body;
    const result = await ReviewService.createReview(reviewData, req?.user?._id);

    sendResponse<IReview>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review added successfully!',
      data: result,
    });
  }
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ReviewService.getAllReviews(
    paginationOptions,
    req.params.id
  );

  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ReviewService.getSingleReview(id);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully !',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
};
