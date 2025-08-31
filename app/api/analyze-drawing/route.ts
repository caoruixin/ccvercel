import { NextRequest, NextResponse } from 'next/server'
import { getModelConfig } from '@/config/models'

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || ''
const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

export async function POST(request: NextRequest) {
  try {
    const { imageData, modelName } = await request.json()
    
    if (!imageData) {
      return NextResponse.json(
        { error: '未提供图片数据' },
        { status: 400 }
      )
    }

    if (!DASHSCOPE_API_KEY) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      )
    }

    // 获取模型配置
    const modelConfig = getModelConfig(modelName)
    
    // 构建请求体
    const requestBody = {
      model: modelConfig.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: modelConfig.prompt || '请猜测这幅画画的是什么？请用简短的中文回答。'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.maxTokens
    }

    // 调用阿里云百炼平台API
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API调用失败:', response.status, errorText)
      return NextResponse.json(
        { error: 'AI分析失败，请稍后重试' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    // 提取AI的猜测结果
    const guess = result.choices?.[0]?.message?.content || '无法识别'
    
    return NextResponse.json({
      guess,
      success: true,
      model: modelConfig.displayName
    })
  } catch (error) {
    console.error('处理请求时出错:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}