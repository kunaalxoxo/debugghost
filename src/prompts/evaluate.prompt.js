export function buildEvaluatePrompt(
  question,
  userAnswer,
  errorMessage,
  category,
) {
  return [
    {
      role: 'system',
      content:
        'Evaluate if the answer shows understanding progress. Be generous. Return ONLY valid JSON: { verdict: "correct"|"partial"|"incorrect", encouragement: string max 15 words, shouldEscalate: boolean }',
    },
    {
      role: 'user',
      content: `Question: ${question}\nUser answer: ${userAnswer}\nError: ${errorMessage}\nCategory: ${category}`,
    },
  ]
}

