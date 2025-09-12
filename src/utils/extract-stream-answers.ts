function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    if (acc && key.match(/^\d+$/)) {
      return acc[Number(key)]
    }
    return acc ? acc[key] : undefined
  }, obj)
}

function extractStreamAnswers(
  content: string,
  fieldPath: string = 'answers'
): string | null {
  let result = ''

  content.split('\n').forEach((line) => {
    if (line.startsWith('data:')) {
      try {
        const json = JSON.parse(line.replace(/^data:\s*/, ''))
        const value = getByPath(json, fieldPath)
        if (typeof value === 'string') {
          result += value
        }
      } catch (e) {
        return null
      }
    }
  })

  return result
}

export { extractStreamAnswers }
