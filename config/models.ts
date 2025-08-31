// AI视觉模型配置
export interface ModelConfig {
  name: string
  displayName: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  prompt?: string
  baseUrl?: string
  apiKeyEnv?: string
}

// 阿里云百炼平台模型配置
export const ALIYUN_MODELS: Record<string, ModelConfig> = {
  'qwen-vl-plus-latest': {
    name: 'qwen-vl-plus-latest',
    displayName: 'Qwen-VL Plus (最新版)',
    description: '平衡性能和准确度，适合大多数场景',
    model: 'qwen-vl-plus-latest',
    temperature: 0.7,
    maxTokens: 100,
    prompt: '请猜测这幅画画的是什么？请用简短的中文回答，只说出你认为画的是什么物体或场景，不需要解释。如果看不清楚，请根据轮廓和形状大胆猜测。'
  },
  'qwen-vl-max-latest': {
    name: 'qwen-vl-max-latest',
    displayName: 'Qwen-VL Max (最强版)',
    description: '最强识别能力，适合复杂图像',
    model: 'qwen-vl-max-latest',
    temperature: 0.5,
    maxTokens: 150,
    prompt: '请仔细观察这幅画，分析其轮廓、形状和细节特征，猜测画的是什么。请用简洁的中文词语回答。'
  },
  'qwen-vl-plus': {
    name: 'qwen-vl-plus',
    displayName: 'Qwen-VL Plus (标准版)',
    description: '标准版本，性价比高',
    model: 'qwen-vl-plus',
    temperature: 0.6,
    maxTokens: 80,
    prompt: '这是一幅简笔画，请猜测画的内容。用中文简短回答。'
  },
  'qwen-vl-max': {
    name: 'qwen-vl-max',
    displayName: 'Qwen-VL Max (标准版)',
    description: '高级版本，准确度更高',
    model: 'qwen-vl-max',
    temperature: 0.4,
    maxTokens: 120,
    prompt: '分析这幅画的内容并猜测是什么。请给出最可能的答案，用中文回答。'
  }
}

// 获取默认模型配置
export const DEFAULT_MODEL = 'qwen-vl-plus-latest'

// 获取模型配置
export function getModelConfig(modelName?: string): ModelConfig {
  const selectedModel = modelName || process.env.NEXT_PUBLIC_AI_MODEL || DEFAULT_MODEL
  return ALIYUN_MODELS[selectedModel] || ALIYUN_MODELS[DEFAULT_MODEL]
}

// 模型能力对比接口
interface ModelComparison {
  speed: number
  accuracy: number
  cost: number
  features: string[]
}

// 模型能力对比
export const MODEL_COMPARISON: Record<string, ModelComparison> = {
  'qwen-vl-plus-latest': {
    speed: 4,
    accuracy: 4,
    cost: 3,
    features: ['快速响应', '准确度高', '支持中文']
  },
  'qwen-vl-max-latest': {
    speed: 3,
    accuracy: 5,
    cost: 5,
    features: ['最高准确度', '复杂图像识别', '详细分析']
  },
  'qwen-vl-plus': {
    speed: 5,
    accuracy: 3,
    cost: 2,
    features: ['响应极快', '基础识别', '成本低']
  },
  'qwen-vl-max': {
    speed: 3,
    accuracy: 4,
    cost: 4,
    features: ['准确度高', '稳定性好', '适合生产']
  }
}