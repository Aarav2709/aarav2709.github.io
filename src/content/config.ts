import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    previewImage: z.string().optional(),
    previewAlt: z.string().optional(),
    stars: z.number().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

export const collections = {
  projects: projectsCollection,
};
