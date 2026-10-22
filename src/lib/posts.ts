type DatedPost = { data: { draft?: boolean; pubDate: Date } };

export function publishedPosts<T extends DatedPost>(posts: T[]): T[] {
  return posts.filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function readingMinutes(body: string): number {
  const chinese = body.match(/[\p{Script=Han}]/gu)?.length ?? 0;
  const words = body.match(/[a-zA-Z0-9]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil((chinese + words) / 300));
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replaceAll('-', '.');
}
