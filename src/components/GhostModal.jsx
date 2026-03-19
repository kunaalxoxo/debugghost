import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GhostAvatar from './GhostAvatar.jsx'
import { callAI } from '../hooks/useOpenRouter.js'
import { extractErrorWindow } from '../utils/errorParser.js'
import { buildTaxonomyPrompt } from '../prompts/taxonomy.prompt.js'
import { buildSocraticPrompt } from '../prompts/socratic.prompt.js'
import { buildEvaluatePrompt } from '../prompts/evaluate.prompt.js'

const TAXONOMY_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'
const EVALUATE_MODEL = 'google/gemini-2.0-flash-exp:free'
const MAX_QUESTIONS = 5

function getAiContent(data) {
  return data?.choices?.[0]?.message?.content?.trim?.() || ''
}

function parseJsonPayload(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      return null
    }
  }
}

function GhostModal({ isOpen, onClose, errorMessage, code, language }) {
  const [questionNumber, setQuestionNumber] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const [taxonomyResult, setTaxonomyResult] = useState({
    category: 'other',
    oneLinerExplanation: 'Let us break this down together.',
  })
  const [bypassCount, setBypassCount] = useState(0)
  const [sessionOutcome, setSessionOutcome] = useState(null)

  const { codeWindow, truncatedError } = useMemo(
    () => extractErrorWindow(code || '', errorMessage || ''),
    [code, errorMessage],
  )

  const closeSession = (payload = null) => {
    onClose(payload)
  }

  const fetchSocraticQuestion = async ({
    category,
    nextQuestionNumber,
    previousAnswer = '',
  }) => {
    setIsLoadingQuestion(true)

    const messages = buildSocraticPrompt(
      truncatedError,
      codeWindow,
      category,
      nextQuestionNumber,
      previousAnswer,
    )
    const response = await callAI(TAXONOMY_MODEL, messages, 220, category)
    const content = getAiContent(response?.data)
    const fallback = response?.fallbackQuestion

    setCurrentQuestion(content || fallback)
    setQuestionNumber(nextQuestionNumber)
    setUserAnswer('')
    setIsLoadingQuestion(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let isCancelled = false

    const initSession = async () => {
      setQuestionNumber(1)
      setCurrentQuestion('')
      setUserAnswer('')
      setConversationHistory([])
      setBypassCount(0)
      setSessionOutcome(null)
      setTaxonomyResult({
        category: 'other',
        oneLinerExplanation: 'Let us break this down together.',
      })
      setIsLoadingQuestion(true)

      const taxonomyMessages = buildTaxonomyPrompt(truncatedError, codeWindow)
      const taxonomyResponse = await callAI(TAXONOMY_MODEL, taxonomyMessages, 220, 'other')
      const taxonomyContent = getAiContent(taxonomyResponse?.data)
      const taxonomyJson = parseJsonPayload(taxonomyContent)
      const category = taxonomyJson?.category || 'other'
      const oneLinerExplanation =
        taxonomyJson?.oneLinerExplanation || 'We will inspect your reasoning step by step.'

      if (isCancelled) return
      setTaxonomyResult({ category, oneLinerExplanation })

      await fetchSocraticQuestion({ category, nextQuestionNumber: 1 })
    }

    initSession()

    return () => {
      isCancelled = true
    }
  }, [isOpen, codeWindow, truncatedError])

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim() || isLoadingQuestion || !currentQuestion) {
      return
    }

    const answerText = userAnswer.trim()
    const nextHistory = [...conversationHistory, { question: currentQuestion, answer: answerText }]
    setConversationHistory(nextHistory)

    const messages = buildEvaluatePrompt(
      currentQuestion,
      answerText,
      truncatedError,
      taxonomyResult.category,
    )
    const evaluationResponse = await callAI(EVALUATE_MODEL, messages, 220, taxonomyResult.category)
    const evaluationContent = getAiContent(evaluationResponse?.data)
    const evaluationJson = parseJsonPayload(evaluationContent) ?? {
      verdict: 'partial',
      encouragement: 'Good progress. Keep refining your model.',
      shouldEscalate: true,
    }

    const verdict = evaluationJson.verdict
    const shouldEscalate = Boolean(evaluationJson.shouldEscalate)
    const encouragement =
      evaluationJson.encouragement || 'Good thinking. Keep moving through the issue.'

    if (verdict === 'correct' || (verdict === 'partial' && questionNumber >= 3)) {
      setSessionOutcome('understood')
      setCurrentQuestion(encouragement)
      setTimeout(
        () =>
          closeSession({
            outcome: 'understood',
            errorCategory: taxonomyResult.category,
            questionsAsked: questionNumber,
            answeredCorrectlyOn: questionNumber,
          }),
        2000,
      )
      return
    }

    if (questionNumber >= MAX_QUESTIONS) {
      setSessionOutcome('assisted')
      setCurrentQuestion(
        `Direct assist: start at line ${Math.max(1, codeWindow.split('\n').length > 0 ? 1 : 1)} and verify types/inputs against ${taxonomyResult.category}.`,
      )
      setTimeout(
        () =>
          closeSession({
            outcome: 'assisted',
            errorCategory: taxonomyResult.category,
            questionsAsked: MAX_QUESTIONS,
            answeredCorrectlyOn: null,
          }),
        3000,
      )
      return
    }

    if (shouldEscalate) {
      await fetchSocraticQuestion({
        category: taxonomyResult.category,
        nextQuestionNumber: questionNumber + 1,
        previousAnswer: answerText,
      })
      return
    }

    setCurrentQuestion(encouragement)
    setUserAnswer('')
  }

  const handleSkip = async () => {
    if (isLoadingQuestion) {
      return
    }

    const nextBypassCount = bypassCount + 1
    setBypassCount(nextBypassCount)

    if (nextBypassCount >= 3) {
      setSessionOutcome('bypassed')
      setTimeout(
        () =>
          closeSession({
            outcome: 'bypassed',
            errorCategory: taxonomyResult.category,
            questionsAsked: questionNumber,
            answeredCorrectlyOn: null,
          }),
        2000,
      )
      return
    }

    const nextQuestion = Math.min(questionNumber + 1, MAX_QUESTIONS)
    await fetchSocraticQuestion({
      category: taxonomyResult.category,
      nextQuestionNumber: nextQuestion,
      previousAnswer: '',
    })
  }

  const skipsRemaining = Math.max(0, 3 - bypassCount)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            padding: 20,
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%',
              maxWidth: 500,
              background: '#111111',
              borderRadius: 18,
              border: '1px solid rgba(139, 92, 246, 0.8)',
              boxShadow: '0 0 24px rgba(139, 92, 246, 0.45)',
              padding: '52px 20px 20px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -44,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <GhostAvatar />
            </div>

            <h2
              style={{
                margin: 0,
                color: '#8b5cf6',
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              DebugGhost
            </h2>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  borderRadius: 999,
                  fontSize: 12,
                  padding: '4px 10px',
                  background: 'rgba(251, 146, 60, 0.2)',
                  color: '#fb923c',
                }}
              >
                {taxonomyResult.category}
              </span>
            </div>

            <p
              style={{
                margin: '8px 0 0',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: 13,
              }}
            >
              {taxonomyResult.oneLinerExplanation} ({language})
            </p>

            <div style={{ marginTop: 20, minHeight: 60 }}>
              <AnimatePresence mode="wait">
                {isLoadingQuestion ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ color: '#e5e7eb', fontSize: 22, textAlign: 'center' }}
                  >
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.p
                    key={`${questionNumber}-${currentQuestion}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      margin: 0,
                      color: '#ffffff',
                      fontSize: 20,
                      lineHeight: 1.35,
                    }}
                  >
                    {currentQuestion}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div style={{ marginTop: 14 }}>
              <textarea
                rows={4}
                value={userAnswer}
                onChange={(event) => setUserAnswer(event.target.value)}
                placeholder="Describe your reasoning..."
                style={{
                  width: '100%',
                  resize: 'vertical',
                  borderRadius: 10,
                  border: '1px solid #2b2b2b',
                  background: '#0d0d0d',
                  color: '#ffffff',
                  padding: 12,
                  outline: 'none',
                  boxShadow: '0 0 0 1px transparent',
                }}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={handleAnswerSubmit}
                disabled={isLoadingQuestion}
                style={{
                  background: '#8b5cf6',
                  color: '#fff',
                  border: 0,
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontWeight: 600,
                  cursor: isLoadingQuestion ? 'not-allowed' : 'pointer',
                }}
              >
                Answer →
              </button>

              <button
                type="button"
                onClick={handleSkip}
                disabled={isLoadingQuestion}
                style={{
                  background: 'transparent',
                  color: '#a1a1aa',
                  border: '1px solid #3f3f46',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 12,
                  cursor: isLoadingQuestion ? 'not-allowed' : 'pointer',
                }}
              >
                Skip
              </button>
            </div>

            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717a', fontSize: 12 }}>
                Question {Math.min(questionNumber, MAX_QUESTIONS)} of {MAX_QUESTIONS}
              </span>
              <span style={{ color: '#71717a', fontSize: 12 }}>
                Skips remaining: {skipsRemaining}
              </span>
            </div>

            {sessionOutcome && (
              <p style={{ marginTop: 10, color: '#d4d4d8', fontSize: 13 }}>
                Session outcome: {sessionOutcome}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GhostModal

