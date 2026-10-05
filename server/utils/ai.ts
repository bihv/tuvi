import * as fs from 'node:fs'
import * as path from 'node:path'
import type { H3Event } from 'h3'
import { createError, sendStream, setResponseHeaders } from 'h3'

export interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface StreamAiOptions {
  messages: OpenAiMessage[]
  temperature?: number
}

/**
 * Lấy cấu hình AI từ runtimeConfig hoặc trực tiếp từ file .env
 * Đảm bảo ứng dụng luôn nhận API key mới nhất mà không phụ thuộc vào thời điểm khởi động server
 */
export function resolveAiConfig() {
  let config: any = {}
  try {
    if (typeof useRuntimeConfig === 'function') {
      config = useRuntimeConfig()
    }
  } catch {
    // not in nuxt context
  }
  let apiKey = (config.aiApiKey || process.env.AI_API_KEY || '').trim()
  let baseUrl = (config.aiBaseUrl || process.env.AI_BASE_URL || '').trim()
  let modelName = (config.aiModelName || process.env.AI_MODEL_NAME || '').trim()

  if (!apiKey || apiKey === 'your_api_key_here') {
    try {
      const envPath = path.resolve(process.cwd(), '.env')
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8')
        const keyMatch = envContent.match(/^AI_API_KEY=(.*)$/m)
        const urlMatch = envContent.match(/^AI_BASE_URL=(.*)$/m)
        const modelMatch = envContent.match(/^AI_MODEL_NAME=(.*)$/m)
        if (keyMatch?.[1]) apiKey = keyMatch[1].trim()
        if (urlMatch?.[1]) baseUrl = urlMatch[1].trim()
        if (modelMatch?.[1]) modelName = modelMatch[1].trim()
      }
    } catch {
      // ignore
    }
  }

  baseUrl = baseUrl || 'https://openrouter.ai/api/v1'
  modelName = modelName || 'deepseek/deepseek-chat'

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ''),
    modelName,
  }
}

/**
 * Hàm phân tích các dòng Server-Sent Events (SSE) từ OpenAI và đẩy chunk text vào controller
 * Trả về true nếu gặp tín hiệu kết thúc luồng: data: [DONE]
 */
function processSseLines(
  lines: string[],
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder
): boolean {
  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (!trimmed || trimmed.startsWith(':')) continue
    if (trimmed === 'data: [DONE]') {
      return true
    }
    if (trimmed.startsWith('data: ')) {
      try {
        const json = JSON.parse(trimmed.slice(6))
        const deltaContent = json.choices?.[0]?.delta?.content
        if (deltaContent) {
          controller.enqueue(encoder.encode(deltaContent))
        }
      } catch {
        // Bỏ qua line không đúng chuẩn JSON
      }
    }
  }
  return false
}

/**
 * Xử lý Streaming Text trực tiếp từ AI Provider (OpenAI-compatible)
 * Tuyệt đối không fallback sang bản mẫu giả lập khi gặp lỗi
 */
export async function streamAiCompletion(
  event: H3Event,
  options: StreamAiOptions
): Promise<void> {
  const { apiKey, baseUrl, modelName } = resolveAiConfig()

  // Báo lỗi ngay lập tức nếu chưa có API Key
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('[AI Provider] No valid AI_API_KEY detected in .env or environment.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Chưa cấu hình AI_API_KEY hợp lệ. Vui lòng thiết lập AI_API_KEY trong file .env để kết nối mô hình AI.',
    })
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Content-Type-Options': 'nosniff',
  })

  console.log(`[AI Provider] Calling real AI: model="${modelName}" at ${baseUrl}...`)

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://tuvi.local',
        'X-Title': 'TuVi AI Web',
      },
      body: JSON.stringify({
        model: modelName,
        messages: options.messages,
        stream: true,
        temperature: options.temperature ?? 0.7,
      }),
    })

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => '')
      console.error(`[AI Provider] HTTP ${response.status} from ${baseUrl}: ${errorText}`)
      let parsedError = errorText
      try {
        const json = JSON.parse(errorText)
        parsedError = json.error?.message || json.message || errorText
      } catch {}
      throw createError({
        statusCode: response.status >= 400 && response.status < 600 ? response.status : 502,
        statusMessage: `Lỗi kết nối nhà cung cấp AI (${response.status}): ${parsedError || response.statusText}`,
      })
    }

    // Chuyển đổi SSE stream từ OpenAI sang Text chunk stream cho client
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const reader = response.body.getReader()

    let buffer = ''

    const outputStream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              if (buffer.trim()) {
                processSseLines(buffer.split('\n'), controller, encoder)
              }
              controller.close()
              return
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            const isDone = processSseLines(lines, controller, encoder)
            if (isDone) {
              controller.close()
              return
            }
          }
        } catch (err: any) {
          console.error('[AI Stream] Read error:', err)
          controller.error(err)
        }
      },
      cancel() {
        reader.cancel()
      },
    })

    return sendStream(event, outputStream)
  } catch (err: any) {
    console.error('[AI Provider] Error communicating with AI provider:', err?.message || err)
    if (err?.statusCode) {
      throw err
    }
    throw createError({
      statusCode: 502,
      statusMessage: `Không thể kết nối đến nhà cung cấp AI: ${err?.message || 'Lỗi mạng hoặc máy chủ không phản hồi.'}`,
    })
  }
}
