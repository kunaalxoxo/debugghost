import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BlindSpotChart from './BlindSpotChart.jsx'

const OUTCOME_EMOJI = {
  understood: '🎯',
  bypassed: '💨',
  assisted: '🤝',
}

function SessionSummary({ isOpen, summary, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onClose()
    }, 8000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isOpen, onClose])

  const emoji = OUTCOME_EMOJI[summary?.outcome] || '🤝'

  return (
    <AnimatePresence>
      {isOpen && summary && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            right: 24,
            zIndex: 1100,
            maxWidth: 520,
            margin: '0 auto',
            borderRadius: 16,
            border: '1px solid rgba(139, 92, 246, 0.7)',
            background: '#111111',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }} aria-hidden="true">
                {emoji}
              </span>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 700 }}>Session complete</div>
                <div style={{ color: '#9ca3af', fontSize: 13 }}>
                  Total sessions: {summary.sessionCount}
                </div>
              </div>
            </div>

            <span
              style={{
                display: 'inline-flex',
                borderRadius: 999,
                fontSize: 12,
                padding: '4px 10px',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#c4b5fd',
              }}
            >
              {summary.errorCategory || 'other'}
            </span>
          </div>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            {summary.sessionCount >= 3 && (
              <BlindSpotChart
                fingerprint={summary.fingerprint}
                sessionCount={summary.sessionCount}
              />
            )}
          </div>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 0,
                borderRadius: 10,
                background: '#8b5cf6',
                color: '#ffffff',
                fontWeight: 600,
                padding: '10px 14px',
                cursor: 'pointer',
              }}
            >
              Continue coding →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SessionSummary

