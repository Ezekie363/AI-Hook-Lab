# ⚡ AI Hook Lab

**🔗 在线体验：[https://ai-hook-lab.vercel.app](https://ai-hook-lab.vercel.app)**

> 一键生成 10 个爆款开头 Hook —— 覆盖 8 种经典风格 + 2 个 AI 自由发挥

面向内容创作者的 AI 文案工具。输入主题、选择平台和内容类型，AI 一次返回 10 个不同风格的开头钩子，每个附带风格标签、点击欲评分和推荐理由。无需登录，无数据库，纯前端 + Serverless API。

---

## 功能一览

- **10 个 Hook 一次生成**：前 8 个覆盖悬念式、数据冲击式、故事式、共鸣式、反常识式、干货承诺式、痛点直击式、对话式；后 2 个由 AI 自由发挥
- **5 大平台适配**：小红书 / 抖音 / B站 / YouTube / X，Prompt 针对各平台语境单独优化
- **5 种内容类型**：视频 / 图文 / 产品广告 / 教程 / 观点贴
- **卡片交互**：一键复制、收藏 / 取消收藏
- **历史记录**：最近 20 条，自动淘汰最旧，存于 localStorage
- **收藏夹**：无上限，持久化于 localStorage
- **错误引导**：API Key 缺失时展示清晰配置说明

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16（App Router） |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4 |
| AI 模型 | DeepSeek Chat（OpenAI 兼容接口） |
| 测试 | Vitest + jsdom |
| 部署 | Vercel |
| 持久化 | localStorage（无数据库） |

---

## 本地开发

### 前置条件

- Node.js 18+
- [DeepSeek API Key](https://platform.deepseek.com)（在 API Keys 页面创建）

### 启动步骤

```bash
# 1. 克隆仓库
git clone <your-repo-url>
cd ai-hook-lab

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key：
# DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

---

## 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API Key，仅在服务端读取，不会暴露到浏览器 | ✅ |

`.env.local` 已加入 `.gitignore`，不会被提交。

---

## 项目结构

```
ai-hook-lab/
├── app/
│   ├── layout.tsx          # 根布局，lang="zh-CN"
│   ├── page.tsx            # 唯一页面，全部状态管理
│   ├── globals.css         # Tailwind v4 @theme 变量 + 全局样式
│   └── api/
│       └── generate/
│           └── route.ts    # POST /api/generate，服务端调用 AI
├── components/
│   ├── InputPanel.tsx      # 主题输入 + 平台/类型选择 + 生成按钮
│   ├── HookCard.tsx        # 单个 Hook 卡片（复制、收藏）
│   ├── ResultsGrid.tsx     # 结果网格（骨架屏 + 80ms 淡入动画）
│   ├── HistoryDrawer.tsx   # 历史记录右侧抽屉
│   ├── FavoritesDrawer.tsx # 收藏夹右侧抽屉
│   └── ErrorBanner.tsx     # 错误提示横幅
├── lib/
│   ├── claude.ts           # DeepSeek API 封装 + JSON 解析
│   ├── prompt.ts           # System/User Prompt 构建逻辑
│   └── storage.ts          # localStorage 读写（含 SSR 守卫）
├── types/
│   └── index.ts            # Hook、HistoryEntry、Platform、ContentType 类型定义
└── __tests__/
    └── lib/
        ├── storage.test.ts  # 10 个单元测试
        ├── prompt.test.ts   # 5 个单元测试
        └── claude.test.ts   # 5 个单元测试
```

---

## 可用脚本

```bash
npm run dev        # 启动开发服务器（Turbopack）
npm run build      # 生产构建
npm run start      # 启动生产服务器
npm test           # 运行单元测试（Vitest）
npm run test:watch # 监听模式
npm run lint       # ESLint 检查
```

---

## API 说明

### `POST /api/generate`

**请求体**

```json
{
  "topic": "AI 变现副业",
  "platform": "小红书",
  "contentType": "视频"
}
```

- `topic`：最长 100 字，服务端自动截断，防止 Prompt 注入
- `platform`：枚举值 `小红书 | 抖音 | B站 | YouTube | X`
- `contentType`：枚举值 `视频 | 图文 | 产品广告 | 教程 | 观点贴`

**成功响应 200**

```json
{
  "hooks": [
    {
      "id": "uuid",
      "style": "悬念式",
      "content": "你以为 AI 副业很难？90% 的人都想错了...",
      "score": 9.2,
      "reason": "制造认知落差，强迫读者继续看下去",
      "isFavorite": false
    }
  ]
}
```

**错误响应**

```json
{ "error": "错误描述", "code": "NO_API_KEY | INVALID_INPUT | PARSE_ERROR | CLAUDE_ERROR" }
```

---

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入该仓库
3. 在 **Settings → Environment Variables** 中添加：
   ```
   DEEPSEEK_API_KEY = sk-xxxxxxxxxxxxxxxx
   ```
4. 部署完成

> **注意**：Vercel Hobby 计划 Serverless Function 超时为 10 秒。DeepSeek 生成 10 个 Hook 通常在 5-8 秒内完成，属于正常范围。如需更稳定，可升级 Vercel Pro 或切换到 Edge Runtime。

---

## 安全说明

- API Key 仅在服务端（`lib/claude.ts`、`app/api/generate/route.ts`）读取，绝不通过 `NEXT_PUBLIC_` 前缀暴露到客户端
- 输入验证：platform / contentType 使用服务端白名单校验；topic 强制截断至 100 字
- localStorage 仅存储用户自己生成的 Hook 文本，无任何敏感信息
- **上线提醒**：当前无速率限制，公开部署后建议在 Vercel Dashboard 开启 WAF 或限制访问来源，防止 API 额度被滥用

---

## 许可证

MIT
