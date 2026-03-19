import { useCallback, useMemo, useRef, useState } from 'react'
import {
  getFingerprint,
  getSessionCount,
  saveSession,
} from '../services/fingerprint.js'

function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function useSession() {
  const activeSessionIdRef = useRef(null)
  const [sessionCount, setSessionCount] = useState(() => getSessionCount())
  const [fingerprint, setFingerprint] = useState(() => getFingerprint())

  const refreshFingerprint = useCallback(() => {
    setSessionCount(getSessionCount())
    setFingerprint(getFingerprint())
  }, [])

  const startSession = useCallback(() => {
    if (activeSessionIdRef.current) {
      return activeSessionIdRef.current
    }

    const id = createSessionId()
    activeSessionIdRef.current = id
    return id
  }, [])

  const endSession = useCallback(
    ({ errorCategory, questionsAsked, outcome, answeredCorrectlyOn }) => {
      const activeId = activeSessionIdRef.current ?? createSessionId()
      const saved = saveSession({
        id: activeId,
        timestamp: Date.now(),
        errorCategory,
        questionsAsked,
        outcome,
        answeredCorrectlyOn,
      })

      activeSessionIdRef.current = null
      refreshFingerprint()
      return saved
    },
    [refreshFingerprint],
  )

  return useMemo(
    () => ({
      startSession,
      endSession,
      sessionCount,
      fingerprint,
      refreshFingerprint,
    }),
    [startSession, endSession, sessionCount, fingerprint, refreshFingerprint],
  )
}

export default useSession

