import { z } from 'zod';
import { breed, label, location } from './cow.constant';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string(),
    age: z.number(),
    price: z.number(),
    location: z.enum([...location] as [string, ...string[]]),
    breed: z.enum([...breed] as [string, ...string[]]),
    weight: z.number(),
    label: z.enum([...label] as [string, ...string[]]).optional(),
    seller: z.string(),
    profileImage: z.string().optional(),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z.number().optional(),
    location: z.enum([...location] as [string, ...string[]]).optional(),
    breed: z.enum([...breed] as [string, ...string[]]).optional(),
    weight: z.number().optional(),
    label: z.enum([...label] as [string, ...string[]]).optional(),
    seller: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const CowValidaion = {
  createCowZodSchema,
  updateCowZodSchema,
};
