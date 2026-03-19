const LINE_PATTERNS = [/line\s+(\d+)/i, /:(\d+):/]

function findLineNumber(errorMessage) {
  for (const pattern of LINE_PATTERNS) {
    const match = errorMessage.match(pattern)
    if (match?.[1]) {
      return Number.parseInt(match[1], 10)
    }
  }
  return null
}

export function extractErrorWindow(fullCode, errorMessage) {
  const lines = fullCode.split('\n')
  const truncatedError = (errorMessage || '').slice(0, 500)
  const lineNumber = findLineNumber(errorMessage || '')

  if (!lineNumber || Number.isNaN(lineNumber)) {
    return {
      codeWindow: lines.slice(0, 30).join('\n'),
      truncatedError,
    }
  }

  const centerIndex = Math.max(lineNumber - 1, 0)
  const start = Math.max(centerIndex - 15, 0)
  const end = Math.min(centerIndex + 16, lines.length)

  return {
    codeWindow: lines.slice(start, end).join('\n'),
    truncatedError,
  }
}

