const LANG_OPTIONS = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
]

function ControlBar({
  language,
  onLanguageChange,
  onRun,
  isRunning,
  stdout,
  stderr,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          style={{
            background: '#151515',
            border: '1px solid #2d2d2d',
            color: '#e5e7eb',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 14,
          }}
        >
          {LANG_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          style={{
            background: '#8b5cf6',
            color: '#ffffff',
            border: 0,
            borderRadius: 8,
            padding: '10px 16px',
            fontWeight: 600,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            opacity: isRunning ? 0.8 : 1,
          }}
        >
          {isRunning && (
            <span
              style={{
                width: 12,
                height: 12,
                border: '2px solid rgba(255,255,255,0.5)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block',
              }}
            />
          )}
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      <div
        style={{
          background: '#111111',
          border: '1px solid #2d2d2d',
          borderRadius: 12,
          padding: 14,
          flex: 1,
          overflow: 'auto',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          whiteSpace: 'pre-wrap',
        }}
      >
        <div style={{ color: '#22c55e', minHeight: 80 }}>
          {stdout || 'stdout will appear here...'}
        </div>
        <div
          style={{
            color: '#ef4444',
            borderTop: '1px solid #252525',
            marginTop: 10,
            paddingTop: 10,
            minHeight: 80,
          }}
        >
          {stderr || 'stderr will appear here...'}
        </div>
      </div>
    </div>
  )
}

export default ControlBar

