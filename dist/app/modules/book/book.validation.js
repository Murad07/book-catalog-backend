"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidaion = void 0;
const zod_1 = require("zod");
const createBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        author: zod_1.z.string(),
        genre: zod_1.z.string(),
        publicationDate: zod_1.z.string(),
    }),
});
const updateBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        publicationDate: zod_1.z.string().optional(),
    }),
});
exports.BookValidaion = {
    createBookZodSchema,
    updateBookZodSchema,
};
