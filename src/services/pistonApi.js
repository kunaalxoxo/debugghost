import axios from 'axios'

const PISTON_EXECUTE_URL = 'https://emkc.org/api/v2/piston/execute'

const unavailableResponse = {
  stdout: '',
  stderr: 'Code runner unavailable. Check your connection.',
  exitCode: -1,
}

export async function executeCode({ language, content }) {
  try {
    const response = await axios.post(
      PISTON_EXECUTE_URL,
      {
        language,
        version: '*',
        files: [{ content }],
      },
      {
        timeout: 10000,
      },
    )

    const run = response?.data?.run ?? {}
    return {
      stdout: run.stdout ?? '',
      stderr: run.stderr ?? '',
      exitCode: run.code ?? run.exitCode ?? 0,
    }
  } catch {
    return unavailableResponse
  }
}

