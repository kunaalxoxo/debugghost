export const FALLBACK_QUESTIONS = {
  async_execution_model: [
    'What order do you expect these async steps to run in?',
    'Which part must complete before the next statement is safe?',
    'Where might timing differences change the observed value?',
  ],
  variable_scope: [
    'Where is this variable declared relative to where it is used?',
    'Which block or function owns this identifier at runtime?',
    'What value do you expect this name to reference here?',
  ],
  type_coercion: [
    'What are the runtime types of the values in this expression?',
    'Could implicit conversion change the result you expect?',
    'What would this comparison do with strict type matching?',
  ],
  off_by_one: [
    'What are the exact start and end bounds of this loop?',
    'Should this boundary be inclusive or exclusive?',
    'Which index is the first invalid position for this data?',
  ],
  reference_vs_value: [
    'Are you modifying a shared object or an independent copy?',
    'Which variables point to the same underlying data?',
    'Where do you need cloning to avoid side effects?',
  ],
  algorithm_logic: [
    'What invariant should remain true after each step?',
    'At what step does the current flow diverge from your plan?',
    'Can you describe the expected state transition at this point?',
  ],
  api_contract: [
    'What exact input shape does this API expect?',
    'Which required field or type might be missing here?',
    'How does the API document success versus error responses?',
  ],
  syntax_familiarity: [
    'Which part of this syntax form feels least certain to you?',
    'What does this construct require in this language?',
    'How could you rewrite this in a simpler equivalent syntax?',
  ],
  other: [
    'What behavior were you expecting before this error appeared?',
    'What changed right before this issue started happening?',
    'What small check could confirm your current hypothesis?',
  ],
}

