export function buildSocraticPrompt(
  errorMessage,
  codeWindow,
  category,
  questionNumber,
  previousAnswer,
) {
  return [
    {
      role: 'system',
      content:
        'You are DebugGhost. Ask ONE question (max 2 sentences) to nudge toward understanding WITHOUT revealing the fix. Q1=ask about intent. Q2=ask about mechanism. Q3=convergent. Never say "you\'re wrong". Never show code. Be curious not corrective.',
    },
    {
      role: 'user',
      content: `Error:\n${errorMessage}\n\nCode:\n${codeWindow}\n\nCategory: ${category}\nQuestion number: ${questionNumber}\nPrevious answer: ${previousAnswer || 'N/A'}`,
    },
  ]
}

