import { z } from 'zod';

import { Dictionary } from '@/core/lib/dict';

export const getMenuFormSchema = (dictionary: Dictionary) => {
  return z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    name: z.string().min(1, {
      message: dictionary.forms.name + " " + dictionary.errors.required,
    }),
    description: z.string().optional(),
  });
};

export type MenuFormData = z.infer<ReturnType<typeof getMenuFormSchema>>;
