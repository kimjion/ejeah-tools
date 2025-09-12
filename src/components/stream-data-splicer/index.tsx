import { useState, useEffect } from 'react'
import { extractStreamAnswers } from '@/utils/extract-stream-answers'

const StreamDataSplicer = () => {
  const [content, setContent] = useState('data: {"answer": "hello"}\n\ndata: {"answer": " world"}\n\ndata: {"answer": "!"}')
  const [fieldPath, setFieldPath] = useState('answer')
  const [result, setResult] = useState<string | null>('')

  useEffect(() => {
    if (content.trim()) {
      try {
        const extracted = extractStreamAnswers(content, fieldPath)
        setResult(extracted)
      } catch (error) {
        setResult(null)
      }
    } else {
      setResult('')
    }
  }, [content, fieldPath])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-64px)]">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="fieldPath" className="text-sm font-semibold text-gray-700">
            字段路径：
          </label>
          <input
            id="fieldPath"
            type="text"
            value={fieldPath}
            onChange={(e) => setFieldPath(e.target.value)}
            placeholder="例如: answer 或 data.content"
            className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        
        <div className="flex flex-col flex-1 min-h-0">
          <label htmlFor="content" className="text-sm font-semibold text-gray-700 mb-2">
            流数据内容：
          </label>
          <div className="border-2 border-gray-200 rounded-lg bg-white flex-1 overflow-hidden">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="粘贴流数据内容..."
              className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">提取结果：</h3>
        <div className="border-2 border-gray-200 rounded-lg bg-gray-50 flex-1 overflow-auto">
          <div className="p-4 h-full">
            {result === null ? (
              <div className="text-red-500 italic text-center py-10">解析错误，请检查输入格式</div>
            ) : result === '' ? (
              <div className="text-gray-400 italic text-center py-10">请输入内容进行提取</div>
            ) : (
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-900">{result}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamDataSplicer
