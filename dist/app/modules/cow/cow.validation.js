"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidaion = void 0;
const zod_1 = require("zod");
const cow_constant_1 = require("./cow.constant");
const createCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        age: zod_1.z.number(),
        price: zod_1.z.number(),
        location: zod_1.z.enum([...cow_constant_1.location]),
        breed: zod_1.z.enum([...cow_constant_1.breed]),
        weight: zod_1.z.number(),
        label: zod_1.z.enum([...cow_constant_1.label]).optional(),
        seller: zod_1.z.string(),
        profileImage: zod_1.z.string().optional(),
    }),
});
const updateCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        location: zod_1.z.enum([...cow_constant_1.location]).optional(),
        breed: zod_1.z.enum([...cow_constant_1.breed]).optional(),
        weight: zod_1.z.number().optional(),
        label: zod_1.z.enum([...cow_constant_1.label]).optional(),
        seller: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
exports.CowValidaion = {
    createCowZodSchema,
    updateCowZodSchema,
};
