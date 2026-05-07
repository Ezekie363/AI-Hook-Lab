import type { Platform, ContentType } from '@/types'

const PLATFORM_HINTS: Record<Platform, string> = {
  小红书: '小红书平台：口语化，可加 emoji，女性友好，第一句话要引发共鸣或好奇心。',
  抖音: '抖音平台：节奏感极强，第一句话就要是高潮，简短有力，不超过 20 字。',
  B站: 'B站平台：可以更长，二次元/技术圈语言 OK，可以用"ww""绝对""史诗级"等词。',
  YouTube: 'YouTube平台：标题党风格，数字效果好，夸张但可信，激发点击欲望。',
  X: 'X（原Twitter）平台：简练，观点鲜明，有争议性，能引发转发和讨论。',
}

export function buildSystemPrompt(platform: Platform): string {
  return `你是一位专业的爆款内容文案专家，擅长为不同社媒平台创作高点击率的开头 Hook。

平台特性参考：
${PLATFORM_HINTS[platform]}

输出规则（严格遵守）：
1. 全部使用中文
2. 只输出一个 JSON 数组，不要有任何额外文字、解释或 markdown 代码块
3. 数组包含恰好 10 个对象，每个对象格式如下：
   {"style":"风格名","content":"hook 正文","score":8,"reason":"推荐理由 1-2 句"}
4. score 为整数，范围 1-10，代表该 hook 的点击欲强度
5. reason 说明为什么这个 hook 有效，不超过 30 字`
}

export function buildUserPrompt(
  topic: string,
  platform: Platform,
  contentType: ContentType
): string {
  return `主题：${topic}
平台：${platform}
内容类型：${contentType}

请生成 10 个不同风格的开头 Hook。

前 8 个必须严格按以下风格顺序，每种风格一个：
1. 悬念式（设置悬念，吊人胃口）
2. 数据冲击式（具体数字制造震撼）
3. 故事式（以个人经历切入）
4. 共鸣式（说出目标用户心里话）
5. 反常识式（颠覆认知，制造好奇）
6. 干货承诺式（直接承诺有价值的内容）
7. 痛点直击式（精准戳中用户痛点）
8. 对话式（直接对话感，拉近距离）

第 9、10 个由你根据主题自由选择最合适的创意角度，style 字段填写你自选的风格名。

直接输出 JSON 数组，无其他内容。`
}
