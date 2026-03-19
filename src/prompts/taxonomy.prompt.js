export function buildTaxonomyPrompt(errorMessage, codeWindow) {
  return [
    {
      role: 'system',
      content:
        'You are a programming cognition analyst. Given an error and code, classify the COGNITIVE ORIGIN. Return ONLY valid JSON: { category, confidence, oneLinerExplanation }. Categories: async_execution_model, variable_scope, type_coercion, off_by_one, reference_vs_value, algorithm_logic, api_contract, syntax_familiarity, other',
    },
    {
      role: 'user',
      content: `Error:\n${errorMessage}\n\nCode:\n${codeWindow}`,
    },
  ]
}

