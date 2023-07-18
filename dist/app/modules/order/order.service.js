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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const book_model_1 = require("../book/book.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const { book, buyer } = order;
    const buyerUser = yield user_model_1.User.findById(buyer);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (buyerUser) {
            const bookData = yield book_model_1.Book.findById(book).populate('seller');
            const sellerUser = yield user_model_1.User.findById(bookData.seller);
            // Check buyer have enough budget to buy book
            if (buyerUser.budget < bookData.price) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough money to buy this book');
            }
            else if (bookData.label === 'sold out') {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not available for sell');
            }
            else {
                const updatedBook = yield book_model_1.Book.findByIdAndUpdate(book, {
                    label: 'sold out',
                });
                if (!updatedBook) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update book');
                }
            }
            if (sellerUser) {
                sellerUser.income += bookData.price;
                const updatedSellerUser = yield sellerUser.updateOne({
                    income: sellerUser.income,
                });
                if (!updatedSellerUser) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update seller');
                }
            }
            buyerUser.budget -= bookData.price;
            const updatedBuyerUser = yield buyerUser.updateOne({
                budget: buyerUser.budget,
            });
            if (!updatedBuyerUser) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update buyer');
            }
        }
        const newOrder = yield order_model_1.Order.create(order);
        if (!newOrder) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create order');
        }
        yield session.commitTransaction();
        yield session.endSession();
        // Populate all data are updated
        const orderData = yield order_model_1.Order.findById(newOrder.id)
            .populate('book')
            .populate('buyer')
            .populate({
            path: 'book',
            populate: {
                path: 'seller',
            },
        });
        return orderData;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getAllOrders = (paginationOptions, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    let query = order_model_1.Order.find();
    let countQuery = order_model_1.Order.countDocuments();
    let result = [];
    let total = 0;
    if (userRole === 'buyer') {
        query = query.where('buyer', userId);
        countQuery = countQuery.where('buyer', userId);
        result = yield query
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
        total = yield countQuery;
        if (total === 0) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No Order found !');
        }
    }
    else if (userRole === 'seller') {
        const books = yield book_model_1.Book.find({ seller: userId });
        if (books.length > 0) {
            let orders = [];
            // Fetch orders for each book
            for (const book of books) {
                const bookOrders = yield order_model_1.Order.find({ book: book._id })
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
        }
        else {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No Order found !');
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
});
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findById(id)
        .populate('book')
        .populate('buyer')
        .populate({
        path: 'book',
        populate: {
            path: 'seller',
        },
    });
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getSingleOrder,
};
