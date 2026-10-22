export function matchesPost(
  post: { title: string; description: string; category: string },
  query: string,
  category: string,
): boolean {
  const needle = query.trim().normalize('NFKC').toLocaleLowerCase('zh-CN');
  const haystack = `${post.title} ${post.description} ${post.category}`.normalize('NFKC').toLocaleLowerCase('zh-CN');
  return (category === '全部' || post.category === category) && haystack.includes(needle);
}
