import { useEffect, useMemo, useState } from 'react'

type Unit = 'auto' | 's' | 'ms'

const pad = (value: number) => String(value).padStart(2, '0')

const formatLocal = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

const formatUTC = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`

const toDateTimeLocalValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

const parseTimestamp = (value: string, unit: Unit): Date | null => {
  const trimmed = value.trim()
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null

  const num = Number(trimmed)
  if (!Number.isFinite(num)) return null

  // 自动模式下按绝对值判断：小于 1e11 视为秒级，否则视为毫秒级
  const ms =
    unit === 's'
      ? num * 1000
      : unit === 'ms'
        ? num
        : Math.abs(num) < 1e11
          ? num * 1000
          : num

  const date = new Date(ms)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatRelative = (targetMs: number, nowMs: number) => {
  const diffSeconds = Math.round((targetMs - nowMs) / 1000)
  if (diffSeconds === 0) return '现在'

  const abs = Math.abs(diffSeconds)
  const units: Array<[number, string]> = [
    [31536000, '年'],
    [2592000, '个月'],
    [86400, '天'],
    [3600, '小时'],
    [60, '分钟'],
    [1, '秒'],
  ]
  const matched: [number, string] =
    units.find(([unitSize]) => abs >= unitSize) ?? [1, '秒']
  const [size, label] = matched
  const amount = Math.floor(abs / size)

  return diffSeconds > 0 ? `${amount}${label}后` : `${amount}${label}前`
}

const CopyValue = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  return (
    <div className='flex items-start justify-between gap-3'>
      <span className='text-sm text-gray-900 font-mono break-all'>{value}</span>
      <button
        type='button'
        onClick={handleCopy}
        className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
          copied
            ? 'border-green-300 bg-green-50 text-green-700'
            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        {copied ? '已复制' : '复制'}
      </button>
    </div>
  )
}

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className='px-4 py-3 space-y-1'>
    <p className='text-xs font-medium text-gray-500'>{label}</p>
    <CopyValue value={value} />
  </div>
)

const TimestampConverter = () => {
  const [now, setNow] = useState<number | null>(null)
  const [timezone, setTimezone] = useState('')
  const [timestampInput, setTimestampInput] = useState('')
  const [unit, setUnit] = useState<Unit>('auto')
  const [dateInput, setDateInput] = useState('')

  useEffect(() => {
    const current = Date.now()
    setNow(current)
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    setTimestampInput(String(Math.floor(current / 1000)))
    setDateInput(toDateTimeLocalValue(new Date(current)))

    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const parsedDate = useMemo(
    () => parseTimestamp(timestampInput, unit),
    [timestampInput, unit]
  )

  const parsedDateTime = useMemo(() => {
    if (!dateInput) return null
    const date = new Date(dateInput)
    return Number.isNaN(date.getTime()) ? null : date
  }, [dateInput])

  const fillNowTimestamp = () =>
    setTimestampInput(String(Math.floor(Date.now() / 1000)))

  const fillNowDate = () => setDateInput(toDateTimeLocalValue(new Date()))

  return (
    <div className='max-w-5xl mx-auto space-y-6 font-sans'>
      {/* 当前时间 */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
        <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
          <h2 className='text-base font-semibold text-gray-900'>当前时间</h2>
          {timezone && (
            <span className='text-xs text-gray-500'>时区：{timezone}</span>
          )}
        </div>

        <p className='font-mono text-lg text-gray-900 mb-4'>
          {now === null ? '—' : formatLocal(new Date(now))}
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              秒级时间戳
            </p>
            {now === null ? (
              <span className='text-sm font-mono text-gray-400'>—</span>
            ) : (
              <CopyValue value={String(Math.floor(now / 1000))} />
            )}
          </div>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              毫秒级时间戳
            </p>
            {now === null ? (
              <span className='text-sm font-mono text-gray-400'>—</span>
            ) : (
              <CopyValue value={String(now)} />
            )}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 时间戳 → 日期时间 */}
        <section className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4'>
          <h2 className='text-base font-semibold text-gray-900'>
            时间戳 → 日期时间
          </h2>

          <div className='space-y-2'>
            <label
              htmlFor='timestamp-input'
              className='block text-sm font-medium text-gray-700'
            >
              时间戳
            </label>
            <div className='flex gap-2'>
              <input
                id='timestamp-input'
                type='text'
                inputMode='numeric'
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder='例如：1730000000'
                className='flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className='px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='auto'>自动</option>
                <option value='s'>秒</option>
                <option value='ms'>毫秒</option>
              </select>
            </div>
            <button
              type='button'
              onClick={fillNowTimestamp}
              className='text-sm text-blue-600 hover:text-blue-700 hover:underline'
            >
              使用当前时间
            </button>
          </div>

          {parsedDate ? (
            <div className='rounded-lg border border-gray-200 divide-y divide-gray-200'>
              <ResultRow label='本地时间' value={formatLocal(parsedDate)} />
              <ResultRow label='UTC 时间' value={formatUTC(parsedDate)} />
              <ResultRow label='ISO 8601' value={parsedDate.toISOString()} />
              <ResultRow
                label='相对时间'
                value={
                  now === null
                    ? '—'
                    : formatRelative(parsedDate.getTime(), now)
                }
              />
            </div>
          ) : (
            <p className='text-sm text-red-500'>
              {timestampInput.trim()
                ? '无法解析该时间戳，请输入数字'
                : '请输入时间戳'}
            </p>
          )}
        </section>

        {/* 日期时间 → 时间戳 */}
        <section className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4'>
          <h2 className='text-base font-semibold text-gray-900'>
            日期时间 → 时间戳
          </h2>

          <div className='space-y-2'>
            <label
              htmlFor='date-input'
              className='block text-sm font-medium text-gray-700'
            >
              日期时间（本地时区）
            </label>
            <input
              id='date-input'
              type='datetime-local'
              step={1}
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <button
              type='button'
              onClick={fillNowDate}
              className='text-sm text-blue-600 hover:text-blue-700 hover:underline'
            >
              使用当前时间
            </button>
          </div>

          {parsedDateTime ? (
            <div className='rounded-lg border border-gray-200 divide-y divide-gray-200'>
              <ResultRow
                label='秒级时间戳'
                value={String(Math.floor(parsedDateTime.getTime() / 1000))}
              />
              <ResultRow
                label='毫秒级时间戳'
                value={String(parsedDateTime.getTime())}
              />
            </div>
          ) : (
            <p className='text-sm text-red-500'>
              {dateInput ? '无法解析该日期时间' : '请选择日期时间'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default TimestampConverter
