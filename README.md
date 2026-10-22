# 慢慢记 · 个人生活博客

米白与深绿色的中文生活随笔博客，使用开源 Astro 生成静态网页。没有付费主题、远程字体、图片服务或数据库依赖，适合使用 GitHub Pages 的免费网址发布。

## 先看博客

安装 [Node.js 24](https://nodejs.org/) 或更新的受支持版本，然后在这个文件夹打开终端：

```powershell
npm install
npm run dev
```

打开终端显示的本机地址，通常是 `http://127.0.0.1:4321/`。这个地址仅用于本机预览，不能当作公开博客网址发给别人。

已经安装过依赖时，只需运行 `npm run dev`。退出预览时在终端按 `Ctrl+C`。

## 修改名字和自我介绍

打开 `src/site.config.ts`，修改 `name`（博客名）、`tagline`（副标题）、`description`（简介）、`author`（作者称呼）、`intro`（首页介绍）和 `url`（正式网址）。修改关于页的文字请打开 `src/pages/about.astro`。

首页欢迎语在 `src/pages/index.astro`，全站颜色和字号在 `src/styles/global.css`。所有插画均为项目内原创 SVG，不会加载第三方图片。

## 发布一篇新文章

1. 在 `src/content/posts/` 新建一个英文小写文件名，例如 `my-first-day.md`。文件名会成为文章网址，使用小写字母、数字和短横线，避免重复和发布后随意改名。
2. 复制下面的内容，修改标题、摘要、日期、分类和正文。日期采用 `年-月-日`。
3. 本地预览满意后提交到 GitHub 的 `main` 分支，发布工作流会自动更新网站。

```markdown
---
title: 我的第一篇生活记录
description: 在这里写一两句话，介绍这篇文章。
pubDate: 2026-10-23
category: 生活手记
tags: [日常, 随笔]
featured: false
draft: false
example: false
---

今天想记下一件小事。

## 一个小标题

普通段落直接写在这里。

- 一件有趣的事
- 一个新的想法

> 一段想单独留下的话。
```

`featured: true` 会让文章成为首页精选（存在多篇精选时选择最新的一篇）。`example: true` 会显示“示例随笔”；写自己的文章时设为 `false`。分类自动从已发布文章中生成，新增分类不需要修改代码。

`draft: true` 的文章不会出现在网站页面、RSS 或站点地图中。**公开 GitHub 仓库中的草稿源文件仍然可以被别人读取；私密内容请保存在仓库外，不要上传。**

目前提供三篇已经标注的示例文章，不代表博主的真实经历。开始写作后，可以直接删除或替换 `src/content/posts/` 中这三个示例文件。

### 添加自己的图片

把图片放在 `src/content/posts/` 下的 `images/` 文件夹中。在文章里用相对路径引用：

```markdown
![窗边的一束光](./images/window.jpg)
```

Astro 会处理图片地址，适用于首页域名和仓库子路径。请使用自己的图片或明确允许使用的图片，并填写有意义的图片描述。

## 使用 GitHub Pages 免费上线

1. 登录 GitHub，在自己的账户下创建公开仓库。推荐名称：`swjtucyx2020.github.io`。如果该仓库已有内容，不要覆盖，可改用新仓库名 `manmanji-blog`。
2. 将本项目源码上传到仓库的 `main` 分支，保留目录层级；不要上传 `node_modules/`、`.npm-cache/`、`.astro/`、`.superpowers/`、`artifacts/` 或 `dist/`。
3. 在仓库中打开 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 到 **Actions → Publish personal blog** 运行工作流，或向 `main` 提交一次修改。绿色成功后，在部署结果中打开实际生成的网址。

发布工作流会自动设置网址和子路径。用户站点仓库的预期地址是 `https://swjtucyx2020.github.io/`；普通项目仓库的地址会带上仓库名称。**这些是地址规则，部署成功前不表示网站已经上线。**

换用其他 GitHub 账户时，同步修改 `src/site.config.ts` 的 `url`。工作流会自动读取当前仓库账户，并设置正确的构建地址。

如果电脑上已配置 GitHub 的 Git 登录，可在创建好空仓库后使用：

```powershell
git remote add origin https://github.com/swjtucyx2020/swjtucyx2020.github.io.git
git push -u origin HEAD:main
```

不需要购买域名或填写信用卡。免费服务的额度与政策以 [GitHub Pages 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) 为准。

## 检查博客

```powershell
npm test
npm run verify:drafts
npm run build
npm run verify
```

`npm test` 验证草稿过滤、排序、地址与搜索；`npm run verify:drafts` 用临时草稿进行真实构建，检查其文字和图片均未发布；`npm run build` 清空并重新生成 `dist/`；`npm run verify` 检查页面内链接、RSS 和站点地图。使用 `npm run preview` 可预览生产构建。

项目包含首页、精选文章、文章目录、分类归档、标题与摘要搜索、关于页、404、RSS 和站点地图。没有文章时也会显示清晰的空状态。没有 JavaScript 时仍可直接阅读文章与完整归档。

## 免费资源与许可

- [Astro](https://astro.build/)：开源静态站点框架，MIT 许可。
- [GitHub Pages](https://pages.github.com/)：公开静态网站托管。
- 字体使用操作系统自带字体；SVG 插画与图标随源码提供。
- 项目程序代码、样式、SVG 和建站示例内容按随附 MIT 许可提供。你后续撰写的个人文章与上传图片不因使用本项目而自动采用 MIT 许可，其权利由你自行决定。
