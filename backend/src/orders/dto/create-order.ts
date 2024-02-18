import { z } from 'zod';

export const createOrderSchema = z.object({
  comment: z.string().optional(),
  rate: z.number().optional(),
  itemsIds: z.array(z.string()),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
