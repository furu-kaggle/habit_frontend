import { z } from 'zod';

export const classificationCategorySchema = z.enum(['habit', 'meal', 'ad-hoc']);

export const mealMacrosSchema = z
  .object({
    protein_g: z.number().nullable(),
    fat_g: z.number().nullable(),
    carb_g: z.number().nullable()
  })
  .nullable();

export const mealSchema = z
  .object({
    kcal: z.number().nullable(),
    macros: mealMacrosSchema,
    meal_label: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).nullable()
  })
  .nullable();

export const habitSchema = z
  .object({
    is_recurring_like: z.boolean(),
    suggested_block_min: z
      .enum(['10', '20', '30', '45', '60'])
      .transform((value) => Number(value) as 10 | 20 | 30 | 45 | 60)
  })
  .nullable();

export const classificationSchema = z.object({
  category: classificationCategorySchema,
  confidence: z.number().min(0).max(1),
  meal: mealSchema,
  habit: habitSchema
});

export type ClassificationSchema = z.infer<typeof classificationSchema>;
