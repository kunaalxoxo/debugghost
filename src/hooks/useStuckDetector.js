import { useEffect, useRef, useState } from 'react'

const STUCK_SECONDS = 90
const COOLDOWN_MS = 90_000

function useStuckDetector({ stderr, code, onTrigger }) {
  const [isStuck, setIsStuck] = useState(false)
  const [secondsOnError, setSecondsOnError] = useState(0)
  const [editCount, setEditCount] = useState(0)

  const lastStderrRef = useRef('')
  const errorFirstSeenAtRef = useRef(null)
  const lastTriggerAtRef = useRef(0)
  const lastCodeRef = useRef(code)
  const onTriggerRef = useRef(onTrigger)

  useEffect(() => {
    onTriggerRef.current = onTrigger
  }, [onTrigger])

  useEffect(() => {
    if (!stderr) {
      lastStderrRef.current = ''
      errorFirstSeenAtRef.current = null
      lastCodeRef.current = code
      setEditCount(0)
      setSecondsOnError(0)
      setIsStuck(false)
      return
    }

    if (stderr !== lastStderrRef.current) {
      lastStderrRef.current = stderr
      errorFirstSeenAtRef.current = Date.now()
      lastCodeRef.current = code
      setEditCount(0)
      setSecondsOnError(0)
      setIsStuck(false)
      return
    }

    if (code !== lastCodeRef.current) {
      setEditCount((prev) => prev + 1)
      lastCodeRef.current = code
    }
  }, [stderr, code])

  useEffect(() => {
    if (!stderr || !errorFirstSeenAtRef.current) {
      return
    }

    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - errorFirstSeenAtRef.current) / 1000)
      setSecondsOnError(elapsed)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [stderr, lastStderrRef.current])

  useEffect(() => {
    if (!stderr || !errorFirstSeenAtRef.current) {
      return
    }

    const elapsed = Math.floor((Date.now() - errorFirstSeenAtRef.current) / 1000)
    const shouldTrigger = elapsed > STUCK_SECONDS || editCount > 8
    const inCooldown = Date.now() - lastTriggerAtRef.current < COOLDOWN_MS

    if (!shouldTrigger || inCooldown) {
      return
    }

    lastTriggerAtRef.current = Date.now()
    setIsStuck(true)
    onTriggerRef.current?.()
  }, [stderr, secondsOnError, editCount])

  return {
    isStuck,
    secondsOnError,
    editCount,
  }
}

export default useStuckDetector

