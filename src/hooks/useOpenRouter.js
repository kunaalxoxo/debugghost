import { callOpenRouter } from '../services/openRouterApi.js'
import { FALLBACK_QUESTIONS } from '../data/fallbackQuestions.js'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_CALLS = 30
const DEBOUNCE_MS = 2000
const callTimestampsRef = { current: [] }
const lastCallAtRef = { current: 0 }

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function getRandomFallbackQuestion(category = 'other') {
  const bank = FALLBACK_QUESTIONS[category] ?? FALLBACK_QUESTIONS.other
  const randomIndex = Math.floor(Math.random() * bank.length)
  return bank[randomIndex]
}

export async function callAI(model, messages, maxTokens = 500, category) {
  const now = Date.now()

  callTimestampsRef.current = callTimestampsRef.current.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )

  if (callTimestampsRef.current.length >= RATE_LIMIT_MAX_CALLS) {
    return {
      data: null,
      usedFallback: true,
      fallbackQuestion: getRandomFallbackQuestion(category),
    }
  }

  const elapsedSinceLastCall = now - lastCallAtRef.current
  if (elapsedSinceLastCall < DEBOUNCE_MS) {
    await wait(DEBOUNCE_MS - elapsedSinceLastCall)
  }

  lastCallAtRef.current = Date.now()
  callTimestampsRef.current.push(lastCallAtRef.current)

  const data = await callOpenRouter(model, messages, maxTokens)
  if (data === null) {
    return {
      data: null,
      usedFallback: true,
      fallbackQuestion: getRandomFallbackQuestion(category),
    }
  }

  return { data, usedFallback: false, fallbackQuestion: null }
}

