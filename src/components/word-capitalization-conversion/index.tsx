import { useState } from 'react'

const WordCapitalizationConversion = () => {
  const [inputValue, setInputValue] = useState('')
  const [conversionType, setConversionType] = useState('uppercase')
  const [spaceHandling, setSpaceHandling] = useState('keep')
  const [copied, setCopied] = useState(false)

  // 转换逻辑函数
  const convertText = (
    text: string,
    type: string,
    spaceType: string
  ): string => {
    if (!text) return ''

    let result = ''

    switch (type) {
      case 'lowercase':
        result = text.toLowerCase()
        break
      case 'uppercase':
        result = text.toUpperCase()
        break
      case 'capitalize':
        result = text
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())
        break
      case 'camelCase':
        result = text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[A-Z]/, (char) => char.toLowerCase())
        break
      default:
        result = text.toUpperCase()
    }

    // 处理空格
    switch (spaceType) {
      case 'remove':
        return result.replace(/\s+/g, '')
      case 'underscore':
        return result.replace(/\s+/g, '_')
      case 'hyphen':
        return result.replace(/\s+/g, '-')
      case 'keep':
      default:
        return result
    }
  }

  const outputValue = convertText(inputValue, conversionType, spaceHandling)

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6'>
      <div className='space-y-4'>
        {/* 输入框 */}
        <div className='space-y-2'>
          <label
            htmlFor='input-text'
            className='block text-sm font-medium text-gray-700'
          >
            输入文本
          </label>
          <textarea
            id='input-text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='请输入要转换的文本...'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
            rows={4}
          />
        </div>

        {/* 转换选项 */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            大小写转换
          </label>
          <div className='grid grid-cols-2 gap-3'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='conversion'
                value='uppercase'
                checked={conversionType === 'uppercase'}
                onChange={(e) => setConversionType(e.target.value)}
                className='text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700'>纯大写</span>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='conversion'
                value='lowercase'
                checked={conversionType === 'lowercase'}
                onChange={(e) => setConversionType(e.target.value)}
                className='text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700'>纯小写</span>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='conversion'
                value='capitalize'
                checked={conversionType === 'capitalize'}
                onChange={(e) => setConversionType(e.target.value)}
                className='text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700'>单词首字母大写</span>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='conversion'
                value='camelCase'
                checked={conversionType === 'camelCase'}
                onChange={(e) => setConversionType(e.target.value)}
                className='text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700'>驼峰命名</span>
            </label>
          </div>
        </div>

        {/* 空格处理选项 */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            空格处理
          </label>
          <div className='grid grid-cols-2 gap-3'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='space-handling'
                value='keep'
                checked={spaceHandling === 'keep'}
                onChange={(e) => setSpaceHandling(e.target.value)}
                className='text-green-600 focus:ring-green-500'
              />
              <span className='text-sm text-gray-700'>保留</span>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='space-handling'
                value='remove'
                checked={spaceHandling === 'remove'}
                onChange={(e) => setSpaceHandling(e.target.value)}
                className='text-green-600 focus:ring-green-500'
              />
              <span className='text-sm text-gray-700'>删除</span>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='space-handling'
                value='underscore'
                checked={spaceHandling === 'underscore'}
                onChange={(e) => setSpaceHandling(e.target.value)}
                className='text-green-600 focus:ring-green-500'
              />
              <span className='text-sm text-gray-700'>替换为 _</span>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='space-handling'
                value='hyphen'
                checked={spaceHandling === 'hyphen'}
                onChange={(e) => setSpaceHandling(e.target.value)}
                className='text-green-600 focus:ring-green-500'
              />
              <span className='text-sm text-gray-700'>替换为 -</span>
            </label>
          </div>
        </div>

        {/* 输出框 */}
        <div className='space-y-2'>
          <label
            htmlFor='output-text'
            className='block text-sm font-medium text-gray-700'
          >
            转换结果
          </label>
          <textarea
            id='output-text'
            value={outputValue}
            readOnly
            className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none'
            rows={4}
          />
        </div>

        {/* 复制按钮 */}
        {outputValue && (
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(outputValue)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              } catch (err) {
                console.error('复制失败:', err)
              }
            }}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0'
            }`}
          >
            {copied ? '已复制!' : '复制结果'}
          </button>
        )}
      </div>
    </div>
  )
}

export default WordCapitalizationConversion
