'use client'

import React, { useRef, useState, useEffect, MouseEvent, TouchEvent } from 'react'

interface DrawingCanvasProps {
  onDrawingComplete?: (imageData: string) => void
  isDrawing: boolean
  setIsDrawing: (value: boolean) => void
}

export default function DrawingCanvas({ onDrawingComplete, isDrawing, setIsDrawing }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        setContext(ctx)
        clearCanvas()
      }
    }
  }, [])

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const getCanvasPosition = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    
    const rect = canvasRef.current.getBoundingClientRect()
    
    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getCanvasPosition(e)
    setLastPosition(pos)
  }

  const draw = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!isDrawing || !context || !lastPosition) return

    const currentPos = getCanvasPosition(e)
    
    context.strokeStyle = color
    context.lineWidth = brushSize
    
    context.beginPath()
    context.moveTo(lastPosition.x, lastPosition.y)
    context.lineTo(currentPos.x, currentPos.y)
    context.stroke()
    
    setLastPosition(currentPos)
  }

  const stopDrawing = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (isDrawing) {
      setIsDrawing(false)
      setLastPosition(null)
    }
  }

  const saveImage = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png')
      if (onDrawingComplete) {
        onDrawingComplete(imageData)
      }
    }
  }

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#8B4513', '#808080', '#FFC0CB'
  ]

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">画笔大小:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm">{brushSize}px</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">颜色:</label>
          <div className="flex space-x-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded border-2 ${
                  color === c ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[500px]">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full border-2 border-gray-300 rounded-lg bg-white cursor-crosshair touch-none"
          style={{ maxWidth: '500px', aspectRatio: '1' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          清空画布
        </button>
        <button
          onClick={saveImage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          让AI猜一猜
        </button>
      </div>
    </div>
  )
}