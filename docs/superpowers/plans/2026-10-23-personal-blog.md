# 「慢慢记」Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建并尽可能上线可免费维护的中文生活随笔博客。

**Architecture:** Astro 将 Markdown 内容生成静态页面；公用布局负责导航、元信息与页脚。归档页使用浏览器脚本进行搜索和分类筛选，发布通过 GitHub Actions 完成。

**Tech Stack:** Node.js 24、Astro、TypeScript、原生 CSS、Node 内置测试。

**Spec:** [设计文档](../specs/2026-10-23-personal-blog-design.md)

## Global Constraints

- 暂用名称「慢慢记」，采用米白与深绿色风格，覆盖首页、文章页、分类归档和关于页。
- 不依赖付费主题、付费字体、付费图库或付费服务。
- draft 为 true 的文章不出现在任何发布产物中。
- 关于页不捏造作者的身份、地址、社交账号或联系方式。
- 正式托管首选 GitHub Pages，已有仓库内容不覆盖；上线必须以实际成功部署为准。

## Review Focus

- 草稿内容是否通过文章路径、索引、RSS 或站点地图泄露。
- 仓库子路径部署是否导致导航、静态资源或订阅地址失效。
- 搜索空格、大小写与无结果是否得到正确处理。
- 中文标题、日期、长文与移动屏幕是否可读。
- 没有已发表文章时，首页及归档是否仍有有效内容和操作。

---

### Task 1: 内容模型与页面

**Files:** `package.json`、`astro.config.mjs`、`src/site.config.ts`、`src/content.config.ts`、`src/lib/posts.ts`、`src/lib/paths.ts`、`src/layouts/Base.astro`、`src/components/`、`src/pages/index.astro`、`src/pages/posts/[id].astro`、`src/pages/about.astro`、`src/pages/404.astro`、`src/styles/global.css`、`src/content/posts/*.md`、`tests/blog.test.ts`。

**Interfaces:**
- Consumes: Markdown 的 title、description、pubDate、category、tags、featured、draft。
- Produces: `publishedPosts<T>(posts: T[]): T[]`，过滤草稿并按日期倒序；`withBase(path: string, base: string): string`，生成兼容子路径的内部地址。

- [ ] Step 1: 先写测试：断言草稿被过滤、日期倒序、空文章返回空列表、`withBase('/about/', '/journal/') === '/journal/about/'`、根路径无重复斜线。
- [ ] Step 2: `node --test tests/blog.test.ts`，确认缺少实现导致失败。
- [ ] Step 3: 安装官方 npm 注册表中的稳定 Astro，锁定依赖，编写内容模型、辅助函数及所有阅读页面；提供三篇标注示例的随笔。
- [ ] Step 4: 运行 `npm test` 与 `npm run build`，应全部通过；浏览器检查首页和一篇文章的排版。
- [ ] Step 5: 保存任务提交并记录验证结果。

### Task 2: 归档、搜索与订阅

**Files:** `src/pages/archive.astro`、`src/lib/search.ts`、`src/pages/rss.xml.ts`、`src/pages/sitemap.xml.ts`、`public/`、`tests/search.test.ts`、`scripts/verify-build.mjs`。

**Interfaces:**
- Consumes: Task 1 的 `publishedPosts` 与 `withBase`。
- Produces: `matchesPost(post: {title: string, description: string, category: string}, query: string, category: string): boolean`；RSS、站点地图与可搜索归档。

- [ ] Step 1: 先写搜索测试：中文标题匹配、英文大小写不敏感、首尾空格被忽略、分类与关键词同时生效、无结果返回 false。
- [ ] Step 2: `node --test tests/search.test.ts`，确认缺少实现导致失败。
- [ ] Step 3: 实现归档交互和订阅端点；复用统一的已发布文章过滤逻辑。
- [ ] Step 4: `npm test`、`npm run build`、`npm run verify` 全部通过；临时加入草稿验证发布产物无其标题、正文及路径；以 `/journal/` 为 base 构建验证内部链接。
- [ ] Step 5: 保存任务提交并记录验证结果。

### Task 3: 免费发布与交付

**Files:** `.github/workflows/deploy.yml`、`README.md`、`LICENSE`、`.gitignore`。

**Interfaces:**
- Consumes: `npm ci`、`npm test`、`npm run build`、`npm run verify` 与构建产物 `dist/`。
- Produces: 免费 GitHub Pages 发布流程、中文写作步骤与真实部署结果。

- [ ] Step 1: 根据 Astro/GitHub 官方文档添加构建发布工作流，仅授予必需权限；提供本地预览、改名、写文章、添加图片与删除示例的中文说明。
- [ ] Step 2: 运行完整验证，使用浏览器检查桌面和窄屏、移动导航、搜索及文章目录；检查链接和 RSS。
- [ ] Step 3: 进行一次独立代码审查并修复会影响使用的问题；保留验证记录。
- [ ] Step 4: 在已授权账户创建新公开仓库并启用 Pages，上传已验证内容；遇到登录或权限门槛时保留完成的本地博客与说明，并仅请求不可代办的操作。
- [ ] Step 5: 确认部署成功或明确记录阻碍，交付预览、源码、写作说明与已验证的正式网址。

## 执行方式建议

本项目的页面和内容模型紧密相关，建议由当前助手在本会话内连续实现，最后进行一次独立审查。无需逐任务确认。
