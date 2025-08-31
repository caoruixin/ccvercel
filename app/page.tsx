'use client'

import { useState } from 'react'
import DrawingCanvas from '@/components/DrawingCanvas'
import { ALIYUN_MODELS, DEFAULT_MODEL, MODEL_COMPARISON } from '@/config/models'

interface GuessResult {
  guess: string
  timestamp: Date
  model?: string
}

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentGuess, setCurrentGuess] = useState<string>('')
  const [guessHistory, setGuessHistory] = useState<GuessResult[]>([])
  const [error, setError] = useState<string>('')
  const [showTutorial, setShowTutorial] = useState(true)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [currentModelName, setCurrentModelName] = useState<string>('')

  const handleDrawingComplete = async (imageData: string) => {
    setIsAnalyzing(true)
    setError('')
    setCurrentGuess('')

    try {
      const response = await fetch('/api/analyze-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, modelName: selectedModel }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '分析失败')
      }

      const data = await response.json()
      const newGuess = data.guess

      setCurrentGuess(newGuess)
      setCurrentModelName(data.model || '')
      setGuessHistory(prev => [{
        guess: newGuess,
        timestamp: new Date(),
        model: data.model
      }, ...prev].slice(0, 10)) // 保留最近10条记录
    } catch (err) {
      console.error('分析出错:', err)
      setError(err instanceof Error ? err.message : '分析失败，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题部分 */}
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 AI你画我猜
          </h1>
          <p className="text-gray-600">
            在画布上画画，让AI猜猜你画的是什么！
          </p>
        </header>

        {/* 教程提示 */}
        {showTutorial && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg max-w-2xl mx-auto">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold">如何游玩：</p>
                <ol className="mt-2 space-y-1 text-sm">
                  <li>1. 选择画笔颜色和大小</li>
                  <li>2. 在画布上画出你想让AI猜的内容</li>
                  <li>3. 点击"让AI猜一猜"按钮</li>
                  <li>4. 查看AI的猜测结果！</li>
                </ol>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="ml-4 text-blue-700 hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 画布区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  画板
                </h2>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-600">AI模型:</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(ALIYUN_MODELS).map(([key, model]) => (
                      <option key={key} value={key}>
                        {model.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DrawingCanvas 
                onDrawingComplete={handleDrawingComplete}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
              />
            </div>
          </div>

          {/* 右侧结果区域 */}
          <div className="space-y-6">
            {/* 当前猜测结果 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                AI的猜测
              </h2>
              
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">AI正在思考...</span>
                </div>
              ) : currentGuess ? (
                <div className="text-center py-8">
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {currentGuess}
                  </p>
                  <p className="text-sm text-gray-500">AI认为你画的是这个！</p>
                  {currentModelName && (
                    <p className="text-xs text-gray-400 mt-2">使用模型: {currentModelName}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>等待你的作品...</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* 历史记录 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                猜测历史
              </h2>
              {guessHistory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {guessHistory.map((result, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-700">
                            {result.guess}
                          </span>
                          {result.model && (
                            <span className="block text-xs text-gray-400 mt-1">
                              {result.model}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  还没有猜测记录
                </p>
              )}
            </div>

            {/* 统计信息 */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">游戏统计</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>总猜测次数：</span>
                  <span className="font-bold">{guessHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>当前状态：</span>
                  <span className="font-bold">
                    {isDrawing ? '绘画中' : isAnalyzing ? 'AI分析中' : '等待绘画'}
                  </span>
                </div>
              </div>
            </div>

            {/* 当前模型信息 */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">当前模型</h3>
              <div className="text-xs text-gray-600">
                <p className="font-medium text-blue-600">{ALIYUN_MODELS[selectedModel].displayName}</p>
                <p className="mt-1">{ALIYUN_MODELS[selectedModel].description}</p>
                {MODEL_COMPARISON[selectedModel] && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <span>速度: </span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < MODEL_COMPARISON[selectedModel].speed ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span>准确度: </span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < MODEL_COMPARISON[selectedModel].accuracy ? 'text-green-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <footer className="text-center py-8 text-gray-600 text-sm">
          <p>使用阿里云百炼平台 qwen-vl-plus 模型提供AI识别能力</p>
        </footer>
      </div>
    </main>
  )
}