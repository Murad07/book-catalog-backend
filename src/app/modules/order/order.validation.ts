import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    book: z.string(),
    buyer: z.string(),
  }),
});

export const OrderValidaion = {
  createOrderZodSchema,
};
