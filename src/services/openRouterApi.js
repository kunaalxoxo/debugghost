const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function callOpenRouter(model, messages, maxTokens = 500) {
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'DebugGhost',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
      }),
    })

    if (response.status === 429 || !response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

