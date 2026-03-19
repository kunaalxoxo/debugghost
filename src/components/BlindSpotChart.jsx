import { useMemo, useState } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

const CATEGORY_AXIS_MAP = [
  { key: 'async_execution_model', axis: 'Async' },
  { key: 'variable_scope', axis: 'Scope' },
  { key: 'type_coercion', axis: 'Types' },
  { key: 'off_by_one', axis: 'Off-by-One' },
  { key: 'reference_vs_value', axis: 'References' },
  { key: 'algorithm_logic', axis: 'Logic' },
  { key: 'api_contract', axis: 'API' },
  { key: 'syntax_familiarity', axis: 'Syntax' },
]

function BlindSpotChart({ fingerprint, sessionCount }) {
  const [copied, setCopied] = useState(false)

  const chartData = useMemo(
    () =>
      CATEGORY_AXIS_MAP.map(({ key, axis }) => ({
        axis,
        key,
        value: fingerprint?.[key]?.total || 0,
      })),
    [fingerprint],
  )

  const topCategory = useMemo(() => {
    if (!chartData.length) {
      return 'Syntax'
    }

    const winner = chartData.reduce((best, current) =>
      current.value > best.value ? current : best,
    )

    return winner.axis
  }, [chartData])

  const handleShare = async () => {
    const message = `My biggest coding blind spot is ${topCategory}. Built with DebugGhost — the AI that teaches by NOT giving you the answer. #DebugGhost`
    await navigator.clipboard.writeText(message)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (sessionCount < 3) {
    return (
      <div
        style={{
          marginTop: 12,
          minHeight: 120,
          display: 'grid',
          placeItems: 'center',
          color: '#9ca3af',
          textAlign: 'center',
          fontSize: 13,
        }}
      >
        Complete {3 - sessionCount} more sessions to unlock your Blind Spot Map
      </div>
    )
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: '#ffffff', fontWeight: 700 }}>Your Blind Spot Map</div>
      <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
        Based on {sessionCount} sessions
      </div>

      <div style={{ width: 300, height: 300, margin: '10px auto 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(139,92,246,0.3)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: '#ffffff', fontSize: 11 }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke="#8b5cf6"
              fill="rgba(139,92,246,0.4)"
              strokeWidth={2}
              fillOpacity={1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleShare}
          style={{
            border: '1px solid #3f3f46',
            borderRadius: 10,
            background: 'transparent',
            color: '#e5e7eb',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Share
        </button>
        {copied && (
          <div style={{ color: '#c4b5fd', fontSize: 12, marginTop: 6 }}>Copied!</div>
        )}
      </div>
    </div>
  )
}

export default BlindSpotChart

