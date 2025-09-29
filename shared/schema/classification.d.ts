import { z } from 'zod';
export declare const classificationCategorySchema: z.ZodEnum<["habit", "meal", "ad-hoc"]>;
export declare const mealMacrosSchema: z.ZodNullable<z.ZodObject<{
    protein_g: z.ZodNullable<z.ZodNumber>;
    fat_g: z.ZodNullable<z.ZodNumber>;
    carb_g: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    protein_g: number | null;
    fat_g: number | null;
    carb_g: number | null;
}, {
    protein_g: number | null;
    fat_g: number | null;
    carb_g: number | null;
}>>;
export declare const mealSchema: z.ZodNullable<z.ZodObject<{
    kcal: z.ZodNullable<z.ZodNumber>;
    macros: z.ZodNullable<z.ZodObject<{
        protein_g: z.ZodNullable<z.ZodNumber>;
        fat_g: z.ZodNullable<z.ZodNumber>;
        carb_g: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        protein_g: number | null;
        fat_g: number | null;
        carb_g: number | null;
    }, {
        protein_g: number | null;
        fat_g: number | null;
        carb_g: number | null;
    }>>;
    meal_label: z.ZodNullable<z.ZodEnum<["breakfast", "lunch", "dinner", "snack"]>>;
}, "strip", z.ZodTypeAny, {
    kcal: number | null;
    meal_label: "breakfast" | "lunch" | "dinner" | "snack" | null;
    macros: {
        protein_g: number | null;
        fat_g: number | null;
        carb_g: number | null;
    } | null;
}, {
    kcal: number | null;
    meal_label: "breakfast" | "lunch" | "dinner" | "snack" | null;
    macros: {
        protein_g: number | null;
        fat_g: number | null;
        carb_g: number | null;
    } | null;
}>>;
export declare const habitSchema: z.ZodNullable<z.ZodObject<{
    is_recurring_like: z.ZodBoolean;
    suggested_block_min: z.ZodEffects<z.ZodEnum<["10", "20", "30", "45", "60"]>, 10 | 20 | 30 | 45 | 60, "10" | "20" | "30" | "45" | "60">;
}, "strip", z.ZodTypeAny, {
    is_recurring_like: boolean;
    suggested_block_min: 10 | 20 | 30 | 45 | 60;
}, {
    is_recurring_like: boolean;
    suggested_block_min: "10" | "20" | "30" | "45" | "60";
}>>;
export declare const classificationSchema: z.ZodObject<{
    category: z.ZodEnum<["habit", "meal", "ad-hoc"]>;
    confidence: z.ZodNumber;
    meal: z.ZodNullable<z.ZodObject<{
        kcal: z.ZodNullable<z.ZodNumber>;
        macros: z.ZodNullable<z.ZodObject<{
            protein_g: z.ZodNullable<z.ZodNumber>;
            fat_g: z.ZodNullable<z.ZodNumber>;
            carb_g: z.ZodNullable<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            protein_g: number | null;
            fat_g: number | null;
            carb_g: number | null;
        }, {
            protein_g: number | null;
            fat_g: number | null;
            carb_g: number | null;
        }>>;
        meal_label: z.ZodNullable<z.ZodEnum<["breakfast", "lunch", "dinner", "snack"]>>;
    }, "strip", z.ZodTypeAny, {
        kcal: number | null;
        meal_label: "breakfast" | "lunch" | "dinner" | "snack" | null;
        macros: {
            protein_g: number | null;
            fat_g: number | null;
            carb_g: number | null;
        } | null;
    }, {
        kcal: number | null;
        meal_label: "breakfast" | "lunch" | "dinner" | "snack" | null;
        macros: {
            protein_g: number | null;
            fat_g: number | null;
            carb_g: number | null;
        } | null;
    }>>;
    habit: z.ZodNullable<z.ZodObject<{
        is_recurring_like: z.ZodBoolean;
        suggested_block_min: z.ZodEffects<z.ZodEnum<["10", "20", "30", "45", "60"]>, 10 | 20 | 30 | 45 | 60, "10" | "20" | "30" | "45" | "60">;
    }, "strip", z.ZodTypeAny, {
        is_recurring_like: boolean;
        suggested_block_min: 10 | 20 | 30 | 45 | 60;
    }, {
        is_recurring_like: boolean;
        suggested_block_min: "10" | "20" | "30" | "45" | "60";
    }>>;
}, "strip", z.ZodTypeAny, {
    habit: {
        is_recurring_like: boolean;
        suggested_block_min: 10 | 20 | 30 | 45 | 60;
    } | null;
    meal: {
        kcal: number | null;
        meal_label: "breakfast" | "lunch" | "dinner" | "snack" | null;
        macros: {
            protein_g: number | null;
            fat_g: number | null;
            carb_g: number | null;
        } | null;
    } | null;
    category: "habit" | "meal" | "ad-hoc";
    confidence: number;
}, {
    habit: {
        is_recurring_like: boolean;
        suggested_block_min: "10" | "20" | "30" | "45" | "60";
    } | null;
    meal: {
        kcal: number | null;
        meal_label: "breakfast" | "lunch" | "dinner" | "snack" | null;
        macros: {
            protein_g: number | null;
            fat_g: number | null;
            carb_g: number | null;
        } | null;
    } | null;
    category: "habit" | "meal" | "ad-hoc";
    confidence: number;
}>;
export type ClassificationSchema = z.infer<typeof classificationSchema>;
