import { useState, useRef, useEffect } from 'react'

const BecomeMasterImageGenerator = () => {
  const [text, setText] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const baseImageUrl = '/i-will-be-ace.jpg'

  // 加载基础图片
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = baseImageUrl
    img.onload = () => {
      imageRef.current = img
      setImageSize({ width: img.width, height: img.height })
      generatePreview()
    }
  }, [])

  // 文本变化时重新生成预览
  useEffect(() => {
    if (imageRef.current) {
      generatePreview()
    }
  }, [text])

  // 生成预览
  const generatePreview = () => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    canvas.width = img.width
    canvas.height = img.height

    // 绘制原始图片
    ctx.drawImage(img, 0, 0)

    if (text.trim()) {
      const fullText = `我要成为${text}高手`
      const chars = fullText.split('')

      // 文字区域参数：右上角，宽100px，高175px
      const textAreaWidth = 100
      const textAreaHeight = 175
      const textAreaX = canvas.width - textAreaWidth - 10 // 右边距10px
      const textAreaY = 10 // 上边距10px

      // 设置文字样式 - 竖排文字
      ctx.fillStyle = '#000000' // 黑色文字
      ctx.textAlign = 'center' // 水平居中
      ctx.textBaseline = 'middle' // 垂直居中

      // 计算最佳字体大小和布局
      let bestFontSize = 20
      let bestCharsPerColumn = 0
      let bestColumns = 1
      let foundSolution = false

      // 间距常量
      const charSpacing = 4 // 字符垂直间距
      const columnSpacing = 4 // 列间距/字符水平边距

      // 尝试不同的字体大小，从大到小
      for (let fontSize = 40; fontSize >= 10; fontSize -= 1) {
        ctx.font = `bold ${fontSize}px "Microsoft YaHei", Arial, sans-serif`

        // 计算每个字符占据的单元格尺寸
        const charHeight = fontSize + charSpacing // 单元格高度
        const cellWidth = fontSize + columnSpacing // 单元格宽度（列宽）

        // 尝试1列和2列布局
        for (let columns = 1; columns <= 2; columns++) {
          // 计算每列字数
          const charsPerColumn = Math.ceil(chars.length / columns)

          // 检查总高度是否合适
          const totalHeight = charsPerColumn * charHeight
          if (totalHeight > textAreaHeight) continue // 高度不够

          // 检查总宽度是否合适
          const totalWidth = columns * cellWidth
          if (totalWidth > textAreaWidth) continue // 宽度不够

          // 检查每个字符的实际宽度是否适合单元格
          let allCharsFit = true
          // 允许的字符最大宽度（留2px边距）
          const maxCharWidth = cellWidth

          for (let i = 0; i < chars.length; i++) {
            const measuredWidth = ctx.measureText(chars[i]).width
            if (measuredWidth > maxCharWidth) {
              allCharsFit = false
              break
            }
          }

          if (allCharsFit) {
            bestFontSize = fontSize
            bestCharsPerColumn = charsPerColumn
            bestColumns = columns
            foundSolution = true
            break
          }
        }

        if (foundSolution) {
          break
        }
      }

      // 如果没有找到合适方案，使用最小字体并尝试找到合适布局
      if (!foundSolution) {
        bestFontSize = 10
        ctx.font = `bold ${bestFontSize}px "Microsoft YaHei", Arial, sans-serif`

        const charHeight = bestFontSize + charSpacing
        const cellWidth = bestFontSize + columnSpacing

        // 尝试1列和2列布局
        let foundFallback = false
        for (let columns = 1; columns <= 2; columns++) {
          const charsPerColumn = Math.ceil(chars.length / columns)

          // 检查高度
          const totalHeight = charsPerColumn * charHeight
          if (totalHeight > textAreaHeight) continue

          // 检查宽度
          const totalWidth = columns * cellWidth
          if (totalWidth > textAreaWidth) continue

          // 检查字符宽度
          let allCharsFit = true
          const maxCharWidth = cellWidth

          for (let i = 0; i < chars.length; i++) {
            if (ctx.measureText(chars[i]).width > maxCharWidth) {
              allCharsFit = false
              break
            }
          }

          if (allCharsFit) {
            bestCharsPerColumn = charsPerColumn
            bestColumns = columns
            foundFallback = true
            break
          }
        }

        // 如果仍然找不到合适布局，强制使用2列，但确保高度合适
        if (!foundFallback) {
          bestColumns = 2
          const maxCharsByHeight = Math.floor(textAreaHeight / charHeight)
          bestCharsPerColumn = Math.min(
            Math.ceil(chars.length / bestColumns),
            maxCharsByHeight,
          )
        }
      }

      // 应用最佳字体大小和计算最终尺寸
      ctx.font = `bold ${bestFontSize}px "Microsoft YaHei", Arial, sans-serif`
      const charHeight = bestFontSize + charSpacing
      const cellWidth = bestFontSize + columnSpacing

      // 计算居中位置
      const totalWidth = bestColumns * cellWidth

      // 绘制每个字符
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        const columnIndex = Math.floor(i / bestCharsPerColumn)
        const rowIndex = i % bestCharsPerColumn

        // 如果超出最大列数，停止绘制（添加省略号）
        if (columnIndex >= bestColumns) {
          // 在最后一列最后添加省略号
          const lastColumn = bestColumns - 1
          const lastRow = bestCharsPerColumn - 1
          const x =
            textAreaX +
            (textAreaWidth - totalWidth) / 2 +
            lastColumn * cellWidth +
            cellWidth / 2
          const y =
            textAreaY + lastRow * charHeight + charHeight / 2 + charHeight
          ctx.fillText('…', x, y)
          break
        }

        // 计算字符位置
        const x =
          textAreaX +
          (textAreaWidth - totalWidth) / 2 +
          columnIndex * cellWidth +
          cellWidth / 2
        const y = textAreaY + rowIndex * charHeight + charHeight / 2

        // 绘制字符
        ctx.fillText(char, x, y)
      }
    }

    // 更新预览URL
    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.9))
  }

  // 处理文本变化
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  // 下载图片
  const downloadImage = () => {
    if (!previewUrl) return

    const link = document.createElement('a')
    link.download = `我要成为${text || '高手'}高手.jpg`
    link.href = previewUrl
    link.click()
  }

  return (
    <div className='max-w-4xl mx-auto font-sans'>
      <div className='bg-white rounded-lg shadow border border-gray-200 overflow-hidden'>
        <div className='p-6'>
          <div className='space-y-6'>
            {/* 输入区域 */}
            <div>
              <div className='flex items-center mb-4'>
                <span className='mr-3 text-lg font-medium text-gray-700'>
                  我要成为
                </span>
                <div className='flex-1'>
                  <input
                    type='text'
                    value={text}
                    onChange={handleTextChange}
                    placeholder='输入高手类型'
                    className='w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
                    autoFocus
                  />
                </div>
                <span className='ml-3 text-lg font-medium text-gray-700'>
                  高手
                </span>
              </div>
            </div>

            {/* 预览区域 */}
            <div>
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[350px] flex flex-col items-center justify-center'>
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt='生成的图片预览'
                      className='max-w-full h-auto rounded shadow'
                    />
                    <p className='text-sm text-gray-500 mt-3'>
                      图片尺寸：{imageSize.width} × {imageSize.height} 像素
                    </p>
                  </>
                ) : (
                  <div className='text-center'>
                    <div className='animate-pulse'>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400 mb-3'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <p className='text-gray-500'>正在加载图片...</p>
                  </div>
                )}
              </div>

              {/* 下载按钮 */}
              <div className='mt-4'>
                <button
                  onClick={downloadImage}
                  disabled={!previewUrl}
                  className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                    />
                  </svg>
                  下载图片
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 隐藏的Canvas用于绘制 */}
        <canvas ref={canvasRef} className='hidden' />
      </div>
    </div>
  )
}

export default BecomeMasterImageGenerator
