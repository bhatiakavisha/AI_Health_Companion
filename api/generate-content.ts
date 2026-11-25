declare const process: {
  env: Record<string, string | undefined>;
};

export const config = {
  runtime: 'edge',
};

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const MAX_PROMPT_LENGTH = 20_000;
const MAX_REQUEST_LENGTH = 128_000;
const GEMINI_TIMEOUT_MS = 20_000;

const jsonResponse = (status: number, body: Record<string, unknown>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const errorResponse = (status: number, code: string, message: string): Response =>
  jsonResponse(status, { error: { code, message } });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse(405, 'METHOD_NOT_ALLOWED', 'Only POST requests are supported.');
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() ?? '';
  if (contentType !== 'application/json') {
    return errorResponse(415, 'UNSUPPORTED_MEDIA_TYPE', 'Send the prompt as JSON.');
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_LENGTH) {
    return errorResponse(413, 'REQUEST_TOO_LARGE', 'The request is too large.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, 'INVALID_JSON', 'The request body must be valid JSON.');
  }

  if (
    !isRecord(body) ||
    Object.keys(body).some((key) => key !== 'prompt') ||
    typeof body.prompt !== 'string' ||
    JSON.stringify(body).length > MAX_REQUEST_LENGTH
  ) {
    return errorResponse(400, 'INVALID_PROMPT', 'A text prompt is required.');
  }

  const prompt = body.prompt.trim();
  if (!prompt) {
    return errorResponse(400, 'INVALID_PROMPT', 'A text prompt is required.');
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return errorResponse(413, 'PROMPT_TOO_LARGE', 'The prompt is too long.');
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return errorResponse(
      503,
      'SERVICE_NOT_CONFIGURED',
      'The AI service is not configured. Please contact support.'
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    if (geminiResponse.status === 429) {
      return errorResponse(
        429,
        'AI_RATE_LIMITED',
        'The AI service is temporarily rate-limited. Please wait and try again.'
      );
    }
    if (geminiResponse.status === 400) {
      return errorResponse(
        422,
        'AI_REJECTED_PROMPT',
        'The AI could not process that request. Please revise the prompt and try again.'
      );
    }
    if (geminiResponse.status === 401 || geminiResponse.status === 403) {
      return errorResponse(
        503,
        'AI_SERVICE_UNAVAILABLE',
        'The AI service is temporarily unavailable. Please try again later.'
      );
    }
    if (!geminiResponse.ok) {
      return errorResponse(
        502,
        'AI_UPSTREAM_ERROR',
        'The AI service could not complete the request. Please try again.'
      );
    }

    let responseBody: unknown;
    try {
      responseBody = await geminiResponse.json();
    } catch {
      return errorResponse(
        502,
        'INVALID_AI_RESPONSE',
        'The AI service returned an invalid response. Please try again.'
      );
    }

    if (!isRecord(responseBody) || !Array.isArray(responseBody.candidates)) {
      return errorResponse(
        502,
        'INVALID_AI_RESPONSE',
        'The AI service returned an invalid response. Please try again.'
      );
    }

    if (responseBody.candidates.length === 0) {
      return errorResponse(
        422,
        'AI_NO_RESPONSE',
        'The AI could not generate a response for that request. Please try again.'
      );
    }

    const candidate = responseBody.candidates[0];
    if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) {
      return errorResponse(
        502,
        'INVALID_AI_RESPONSE',
        'The AI service returned an invalid response. Please try again.'
      );
    }

    const text = candidate.content.parts
      .filter(isRecord)
      .map((part) => part.text)
      .filter((part): part is string => typeof part === 'string')
      .join('')
      .trim();

    if (!text) {
      return errorResponse(
        502,
        'EMPTY_AI_RESPONSE',
        'The AI service returned an empty response. Please try again.'
      );
    }

    return jsonResponse(200, { text });
  } catch {
    if (controller.signal.aborted) {
      return errorResponse(
        504,
        'AI_TIMEOUT',
        'The AI service took too long to respond. Please try again.'
      );
    }
    return errorResponse(
      502,
      'AI_CONNECTION_ERROR',
      'Could not connect to the AI service. Please try again later.'
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
