export function withBase(path: string, base: string = '/'): string {
  const prefix = base.replace(/^\/+|\/+$/g, '');
  return `/${prefix ? prefix + '/' : ''}${path.replace(/^\/+/, '')}`;
}
