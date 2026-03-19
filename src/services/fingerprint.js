const STORAGE_KEY = 'debugghost_fingerprint'

function getDefaultStore() {
  return { sessions: [] }
}

function normalizeStore(rawValue) {
  if (!rawValue || typeof rawValue !== 'object') {
    return getDefaultStore()
  }

  if (!Array.isArray(rawValue.sessions)) {
    return getDefaultStore()
  }

  return { sessions: rawValue.sessions }
}

function readStore() {
  if (typeof window === 'undefined') {
    return getDefaultStore()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return getDefaultStore()
  }

  try {
    return normalizeStore(JSON.parse(raw))
  } catch {
    return getDefaultStore()
  }
}

function writeStore(store) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function normalizeSession(session) {
  return {
    id: session.id,
    timestamp: session.timestamp ?? Date.now(),
    errorCategory: session.errorCategory || 'other',
    questionsAsked: Number.isFinite(session.questionsAsked) ? session.questionsAsked : 0,
    outcome: session.outcome || 'assisted',
    answeredCorrectlyOn: Number.isFinite(session.answeredCorrectlyOn)
      ? session.answeredCorrectlyOn
      : null,
  }
}

export function saveSession(session) {
  const store = readStore()
  const normalizedSession = normalizeSession(session)
  store.sessions.push(normalizedSession)
  writeStore(store)
  return normalizedSession
}

export function getFingerprint() {
  const { sessions } = readStore()
  const grouped = {}

  sessions.forEach((session) => {
    const category = session.errorCategory || 'other'

    if (!grouped[category]) {
      grouped[category] = {
        total: 0,
        understood: 0,
        bypassed: 0,
        questionTotal: 0,
      }
    }

    grouped[category].total += 1
    grouped[category].questionTotal += Number.isFinite(session.questionsAsked)
      ? session.questionsAsked
      : 0

    if (session.outcome === 'understood') {
      grouped[category].understood += 1
    }

    if (session.outcome === 'bypassed') {
      grouped[category].bypassed += 1
    }
  })

  const fingerprint = {}

  Object.entries(grouped).forEach(([category, metrics]) => {
    const total = metrics.total || 1
    fingerprint[category] = {
      total: metrics.total,
      understood: metrics.understood,
      bypassRate: Number((metrics.bypassed / total).toFixed(2)),
      avgQuestions: Number((metrics.questionTotal / total).toFixed(2)),
    }
  })

  return fingerprint
}

export function getSessionCount() {
  return readStore().sessions.length
}

export function clearFingerprint() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

