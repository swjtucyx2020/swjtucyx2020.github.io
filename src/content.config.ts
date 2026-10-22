import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

const markdown = glob({ pattern: '*.md', base: './src/content/posts' });
// Filter before Astro registers Markdown image imports. Route filtering alone
// would still copy a draft's unique local images into the public asset directory.
const publishedLoader: Loader = {
  name: 'published-posts',
  async load(context) {
    for (const id of context.store.keys()) {
      if (context.store.get(id)?.data.draft === true) context.store.delete(id);
    }
    await markdown.load({
      ...context,
      store: {
        ...context.store,
        set(entry) {
          if (entry.data.draft === true) {
            context.store.delete(entry.id);
            return false;
          }
          return context.store.set(entry);
        },
      },
    });
  },
};

const posts = defineCollection({
  loader: publishedLoader,
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    category: z.string().min(1),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
  }),
});

export const collections = { posts };
