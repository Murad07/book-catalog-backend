'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BookService = void 0;
const paginationHelper_1 = require('../../../helpers/paginationHelper');
const http_status_1 = __importDefault(require('http-status'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const book_constant_1 = require('./book.constant');
const book_model_1 = require('./book.model');
const config_1 = __importDefault(require('../../../config'));
const createBook = book =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!book.label) {
      book.label = config_1.default.DEFAULT_COW_LABEL;
    }
    const newBook = yield book_model_1.Book.create(book);
    return newBook;
  });
const getAllBooks = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, minPrice, maxPrice } = filters,
      filtersData = __rest(filters, ['searchTerm', 'minPrice', 'maxPrice']);
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper_1.paginationHelpers.calculatePagination(
        paginationOptions
      );
    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: book_constant_1.bookSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }
    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      andConditions.push({
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      });
    } else if (minPrice !== undefined) {
      andConditions.push({
        price: {
          $gte: minPrice,
        },
      });
    } else if (maxPrice !== undefined) {
      andConditions.push({
        price: {
          $lte: maxPrice,
        },
      });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield book_model_1.Book.find(whereConditions)
      .populate('seller')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
    const total = yield book_model_1.Book.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getSingleBook = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id).populate('seller');
    return result;
  });
const updateBook = (id, payload, sellerId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield book_model_1.Book.findOne({
      _id: id,
      seller: sellerId,
    });
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Book not found !'
      );
    }
    const bookData = __rest(payload, []);
    const updatedBookData = Object.assign({}, bookData);
    const result = yield book_model_1.Book.findByIdAndUpdate(
      id,
      updatedBookData,
      {
        new: true,
      }
    );
    return result;
  });
const deleteBook = (id, sellerId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield book_model_1.Book.findOne({
      _id: id,
      seller: sellerId,
    });
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Book not found !'
      );
    }
    const result = yield book_model_1.Book.findByIdAndDelete(id).populate(
      'seller'
    );
    return result;
  });
exports.BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
