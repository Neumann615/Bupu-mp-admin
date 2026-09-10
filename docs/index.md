---
layout: home

hero:
  name: "Zealous-admin"
  text: "现代化后台管理系统"
  tagline: 基于 React + Vite + Ant Design 构建 · 开箱即用 · 极致体验
  image:
    src: /logo.svg
    alt: zealous-admin
  actions:
    - theme: brand
      text: 🚀 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 📖 组件文档
      link: /components/
    - theme: alt
      text: 🔗 在线演示
      link: https://admin.zzzpupu.xin/

features:
  - icon: 🎨
    title: 8 套主题
    details: default 支持主题色/暗色切换 + 7 种定制主题一键应用。
    link: /theme/
  - icon: 📐
    title: 5 种布局 + 响应式
    details: side / only-side / head / only-head / simple，窄屏自动抽屉菜单。
    link: /layout/layout-modes
  - icon: 🔐
    title: 自包含权限体系
    details: 登录/登出/用户状态封装在 layout 包，401 自动分流，token 内置注入。
    link: /layout/
  - icon: 🔧
    title: 50+ 可视化配置
    details: 覆盖 App · Theme · Menu · Page · TopBar 五维度，配置可导出为 TypeScript 代码。
    link: /layout/layout-config
  - icon: 🏷️
    title: 多标签页导航
    details: 拖拽排序、右键菜单、固定标签、图标激活态切换，三种风格。
    link: /layout/tab-bar
  - icon: 🧩
    title: 12 个业务组件
    details: 图标选择器 · 富文本编辑器 · 签名板 · Iframe 外链 · 链接预览 · Markdown · 跑马灯 · 滑块验证码
    link: /components/
  - icon: 📝
    title: 低代码表单设计器
    details: 拖拽搭建 · 37 个组件 · 子表单/表格子表单，设计器与运行时共用同一份 Schema。
    link: /form-designer/
  - icon: 🌐
    title: 中英文国际化
    details: 文案统一从 locales 包读取，antd 语言包懒加载，菜单/标签/面包屑/组件库随语言联动。
    link: /layout/toolbar
  - icon: 🗄️
    title: 内置后端服务
    details: Express + SQLite，用户/角色/菜单/字典完整 CRUD，JWT 认证。
    link: /guide/
---

<style>
/* ---------- Demo link in hero actions ---------- */
.VPHero .VPButton.alt[href*="zzzpupu"] {
  position: relative;
  border-color: #52c41a !important;
  color: #52c41a !important;
  background: rgba(82, 196, 26, 0.05) !important;
}
.VPHero .VPButton.alt[href*="zzzpupu"]:hover {
  border-color: #73d13d !important;
  color: #73d13d !important;
  background: rgba(82, 196, 26, 0.1) !important;
}
.VPHero .VPButton.alt[href*="zzzpupu"]::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #52c41a;
  border-radius: 50%;
  margin-right: 6px;
  animation: dot-pulse 2s ease-in-out infinite;
}

/* ---------- Section divider ---------- */
.section-divider {
  text-align: center;
  margin: 64px auto 32px;
  max-width: 640px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #61DAFB);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  color: var(--vp-c-text-2);
  font-size: 15px;
  margin-top: 8px;
}

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .section-title {
    font-size: 22px;
  }
}
</style>

<!-- Customer Feedback Panel -->
<ClientOnly>
  <FeedbackPanel />
</ClientOnly>


<!-- Tech Stack Marquee (powered by @zealous-admin/components ZaMarquee) -->
<ClientOnly>
  <TechMarquee />
</ClientOnly>
