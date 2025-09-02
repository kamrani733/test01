import { z } from 'zod';

import { Dictionary } from '@/core/lib/dict';

export const getCommentFormSchema = (dictionary: Dictionary) => {
  return z.object({
    content: z.string().optional(),
  });
};

export type CommentFormData = z.infer<ReturnType<typeof getCommentFormSchema>>;
