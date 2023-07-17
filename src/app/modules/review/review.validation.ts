import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    book: z.string(),
    reviewText: z.string(),
  }),
});

export const ReviewValidaion = {
  createReviewZodSchema,
};
