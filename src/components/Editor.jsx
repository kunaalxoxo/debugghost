import MonacoEditor from '@monaco-editor/react'

function Editor({ code, onChange, language }) {
  return (
    <div
      style={{
        height: '100%',
        borderLeft: '3px solid #8b5cf6',
        boxShadow: 'inset 0 0 24px rgba(139, 92, 246, 0.35)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => onChange(value ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          lineNumbersMinChars: 3,
          padding: { top: 16 },
          smoothScrolling: true,
        }}
      />
    </div>
  )
}

export default Editor

