import { z } from 'zod';

export const createStorySchema = z.object({
  title: z.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(50, 'Le titre ne peut pas dépasser 50 caractères'),
  firstParagraph: z.string()
    .min(20, 'Le paragraphe d\'ouverture doit contenir au moins 20 caractères')
    .max(1000, 'Le paragraphe est trop long (max 1000 caractères)'),
  maxContributions: z.number().min(5).max(100),
  turnDurationSeconds: z.number().min(300), // Min 5 mn pour les tests
  isBlindMode: z.boolean(),
  isPrivate: z.boolean(),
});

export type CreateStoryInput = z.infer<typeof createStorySchema>;