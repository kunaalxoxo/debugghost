import { useEffect, useMemo, useState } from 'react'
import GhostAvatar from './components/GhostAvatar.jsx'
import Editor from './components/Editor.jsx'
import ControlBar from './components/ControlBar.jsx'
import GhostModal from './components/GhostModal.jsx'
import SessionSummary from './components/SessionSummary.jsx'
import { executeCode } from './services/pistonApi.js'
import useStuckDetector from './hooks/useStuckDetector.js'
import useSession from './hooks/useSession.js'

const STARTER_SNIPPETS = {
  python: `print("Hello from DebugGhost")`,
  javascript: `console.log("Hello from DebugGhost")`,
  cpp: `#include <iostream>
int main() {
  std::cout << "Hello from DebugGhost" << std::endl;
  return 0;
}`,
  java: `class Main {
  public static void main(String[] args) {
    System.out.println("Hello from DebugGhost");
  }
}`,
  go: `package main
import "fmt"

func main() {
  fmt.Println("Hello from DebugGhost")
}`,
}

function App() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(STARTER_SNIPPETS.python)
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [sessionSummary, setSessionSummary] = useState(null)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  const currentCode = useMemo(() => code, [code])
  const { startSession, endSession, sessionCount } = useSession()

  const { isStuck, resetStuckState } = useStuckDetector({
    stderr,
    code,
    onTrigger: startSession,
  })

  useEffect(() => {
    if (isStuck) {
      startSession()
    }
  }, [isStuck, startSession])

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage)
    setCode(STARTER_SNIPPETS[nextLanguage] ?? '')
    setStdout('')
    setStderr('')
  }

  const handleRun = async () => {
    setIsRunning(true)
    const result = await executeCode({ language, content: currentCode })
    setStdout(result.stdout || '')
    setStderr(result.stderr || '')
    setIsRunning(false)
  }

  const handleGhostClose = (payload) => {
    resetStuckState()

    if (!payload?.outcome) {
      return
    }

    endSession({
      errorCategory: payload.errorCategory,
      questionsAsked: payload.questionsAsked,
      outcome: payload.outcome,
      answeredCorrectlyOn: payload.answeredCorrectlyOn,
    })

    setSessionSummary({
      outcome: payload.outcome,
      errorCategory: payload.errorCategory,
      sessionCount: sessionCount + 1,
    })
    setIsSummaryOpen(true)
  }

  const handleSessionSummaryClose = () => {
    setIsSummaryOpen(false)
    setSessionSummary(null)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        color: '#e5e7eb',
        padding: 16,
        boxSizing: 'border-box',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, color: '#ffffff' }}>DebugGhost</h1>
        <GhostAvatar />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: 16,
          minHeight: 'calc(100vh - 88px)',
        }}
      >
        <div>
          <Editor code={code} onChange={setCode} language={language} />
        </div>
        <div style={{ minWidth: 0 }}>
          <ControlBar
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            isRunning={isRunning}
            stdout={stdout}
            stderr={stderr}
          />
        </div>
      </div>

      <GhostModal
        isOpen={isStuck}
        onClose={handleGhostClose}
        errorMessage={stderr}
        code={code}
        language={language}
      />

      <SessionSummary
        isOpen={isSummaryOpen}
        summary={sessionSummary}
        onClose={handleSessionSummaryClose}
      />
    </div>
  )
}

export default App
