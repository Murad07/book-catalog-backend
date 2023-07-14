'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Book = exports.BookSchema = void 0;
const mongoose_1 = require('mongoose');
const book_constant_1 = require('./book.constant');
exports.BookSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: book_constant_1.location,
    },
    breed: {
      type: String,
      enum: book_constant_1.breed,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: book_constant_1.label,
    },
    category: {
      type: String,
      enum: book_constant_1.category,
    },
    seller: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
exports.Book = (0, mongoose_1.model)('Book', exports.BookSchema);
