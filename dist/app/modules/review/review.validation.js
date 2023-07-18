"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidaion = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        book: zod_1.z.string(),
        reviewText: zod_1.z.string(),
    }),
});
exports.ReviewValidaion = {
    createReviewZodSchema,
};
