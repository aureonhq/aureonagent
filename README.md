# AI Workforce

AI Workforce（AI 劳动力网络）MVP。它不是招聘平台，也不是普通兼职平台；企业按结果调用可调度的 AI 增强劳动力，个人用技能接入网络获得收入。系统自动拆解需求、生成建议报价、匹配合适执行者，并把任务、人才、匹配记录汇总到管理后台。

## 运行

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## MVP 页面

- 首页：平台定位与业务流程介绍
- 企业端发布任务：标题、描述、预算、截止时间、技能、AI 拆解、AI 建议报价
- 个人端资料：姓名、技能标签、可工作时间、期望收入、过往经验
- 任务大厅：任务列表，支持按技能、预算、截止时间筛选
- AI 匹配结果：推荐人才、匹配理由、推荐执行步骤
- 管理后台：企业任务、个人用户、匹配记录

## 项目结构

```text
app/
  globals.css          全局样式和 Tailwind 组件类
  layout.tsx           页面元信息和根布局
  page.tsx             MVP 主应用和六个核心页面
lib/
  mockAi.ts            模拟 AI 拆解、报价和匹配逻辑
  types.ts             核心业务类型
docs/
  database-design.sql  SQLite-first 数据库字段设计
```

## 数据与后端说明

当前版本为可演示 Web MVP，使用 `localStorage` 保存演示数据，模拟 AI 逻辑位于 `lib/mockAi.ts`。后续接入真实后端时，可按 `docs/database-design.sql` 建表，并把 `localStorage` 读写替换为 API 路由、Supabase、Firebase 或 SQLite。
