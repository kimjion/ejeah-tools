// 字符串 -> 数字
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }

  return Math.abs(hash)
}

// 根据字符串生成 HSL 颜色
function stringToColor(str: string, s = 55, l = 65): string {
  const hash = hashString(str)
  const hue = (hash + 200) % 360

  return `hsl(${hue}, ${s}%, ${l}%)`
}

export { stringToColor }
