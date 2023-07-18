"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const review_model_1 = require("./review.model");
const createReview = (review, reviewBy) => __awaiter(void 0, void 0, void 0, function* () {
    review.reviewBy = reviewBy;
    const newReview = yield review_model_1.Review.create(review);
    return newReview;
});
const getAllReviews = (paginationOptions, bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    let result = [];
    let total = 0;
    let reviews = [];
    // Fetch reviews for each book
    const bookReviews = yield review_model_1.Review.find({ book: bookId }).populate('reviewBy');
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
});
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findById(id)
        .populate('book')
        .populate('reviewBy')
        .populate({
        path: 'book',
        populate: {
            path: 'seller',
        },
    });
    return result;
});
exports.ReviewService = {
    createReview,
    getAllReviews,
    getSingleReview,
};
