import { useState, useEffect, useCallback } from 'react'

const PasswordGenerator = () => {
  const [length, setLength] = useState(20)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeLetters, setIncludeLetters] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePassword = useCallback(() => {
    let charset = ''

    if (includeNumbers) charset += '0123456789'
    if (includeLetters)
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (charset === '') {
      setGeneratedPassword('请至少选择一种字符类型')
      return
    }

    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setGeneratedPassword(password)
    setCopied(false)
  }, [length, includeNumbers, includeLetters, includeSymbols])

  const copyToClipboard = async () => {
    if (generatedPassword && !generatedPassword.includes('请至少选择')) {
      try {
        await navigator.clipboard.writeText(generatedPassword)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
  }

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  // 渲染带颜色的密码
  const renderColoredPassword = () => {
    if (!generatedPassword || generatedPassword.includes('请至少选择')) {
      return (
        <span className='text-gray-500'>
          {generatedPassword || '选择字符类型开始生成密码'}
        </span>
      )
    }

    return generatedPassword.split('').map((char, index) => {
      let colorClass = 'text-gray-900'

      if (/[0-9]/.test(char)) {
        colorClass = 'text-blue-600'
      } else if (/[a-zA-Z]/.test(char)) {
        colorClass = 'text-black'
      } else if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(char)) {
        colorClass = 'text-red-600'
      }

      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      )
    })
  }

  return (
    <div className='max-w-lg mx-auto mt-8 font-sans'>
      <div className='bg-white rounded-xl p-8 shadow-lg border border-gray-200'>
        <div className='mb-8'>
          <h3 className='text-gray-700 mb-4 text-base font-medium'>字符类型</h3>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
              <span className='flex items-center'>
                字母 <span className='text-black ml-2 font-mono'>(A-z)</span>
              </span>
              <button
                onClick={() => setIncludeLetters(!includeLetters)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  includeLetters ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    includeLetters ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
              <span className='flex items-center'>
                数字 <span className='text-blue-600 ml-2 font-mono'>(0-9)</span>
              </span>
              <button
                onClick={() => setIncludeNumbers(!includeNumbers)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  includeNumbers ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    includeNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
              <span className='flex items-center'>
                符号{' '}
                <span className='text-red-600 ml-2 font-mono'>(!@#$...)</span>
              </span>
              <button
                onClick={() => setIncludeSymbols(!includeSymbols)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  includeSymbols ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    includeSymbols ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className='mb-8'>
          <h3 className='text-gray-700 mb-4 text-base font-medium'>字符</h3>
          <div className='flex items-center gap-4'>
            <input
              type='range'
              min='6'
              max='100'
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
            />
            <span className='bg-gray-100 px-3 py-2 rounded-lg font-semibold text-gray-700 min-w-12 text-center'>
              {length}
            </span>
          </div>
        </div>

        <div className='mb-4'>
          <div className='bg-gray-50 border-2 border-gray-200 rounded-lg p-4 font-mono text-xl font-bold min-h-16 break-all overflow-hidden'>
            {renderColoredPassword()}
          </div>
        </div>

        <div className='flex gap-3'>
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-600 text-white'
                : generatedPassword && !generatedPassword.includes('请至少选择')
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            onClick={copyToClipboard}
            disabled={
              !generatedPassword || generatedPassword.includes('请至少选择')
            }
          >
            {copied ? '已复制!' : '复制密码'}
          </button>

          <button
            className='flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-blue-600 hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0'
            onClick={generatePassword}
          >
            刷新密码
          </button>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default PasswordGenerator
