<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Keep in sync with HomeView.vue
const API_BASE_URL = 'http://10.1.1.115/api/content'
const FALLBACK_URL = '/json/mock-requets.json'
const TIMEOUT_MS = 10000
const APP_VERSION = '0.0.0'

const isDev = import.meta.env.DEV

interface RequestSnapshot {
  url: string
  method: string
  headers: Record<string, string>
  queryParams: Record<string, string>
}

interface ResponseSnapshot {
  status: number | null
  statusText: string
  latencyMs: number | null
  headers: Record<string, string>
  body: unknown
}

interface ErrorSnapshot {
  message: string
  code: string | null
  type: 'network' | 'timeout' | 'server' | 'auth' | 'unknown'
  stack: string | null
}

interface DiagnosticResult {
  timestamp: string
  online: boolean
  environment: string
  appVersion: string
  apiBaseUrl: string
  timeoutMs: number
  request: RequestSnapshot
  response: ResponseSnapshot | null
  error: ErrorSnapshot | null
}

const result = ref<DiagnosticResult | null>(null)
const running = ref(false)

function classifyError(err: unknown, response?: Response | null): ErrorSnapshot['type'] {
  if (response) {
    if (response.status === 401 || response.status === 403) return 'auth'
    if (response.status >= 500) return 'server'
  }
  if (err instanceof Error) {
    if (err.name === 'AbortError') return 'timeout'
    const msg = err.message.toLowerCase()
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed')) return 'network'
  }
  return 'unknown'
}

function parseHeaders(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {}
  headers.forEach((value, key) => {
    if (key.toLowerCase() === 'authorization') {
      out[key] = value.replace(/^(Bearer\s+)\S+/i, '$1[MASKED]')
    } else {
      out[key] = value
    }
  })
  return out
}

async function runDiagnostic() {
  running.value = true
  result.value = null

  const timestamp = new Date().toISOString()
  const parsed = new URL(API_BASE_URL)

  const requestSnapshot: RequestSnapshot = {
    url: API_BASE_URL,
    method: 'GET',
    headers: { Accept: 'application/json' },
    queryParams: Object.fromEntries(parsed.searchParams.entries()),
  }

  let responseSnapshot: ResponseSnapshot | null = null
  let errorSnapshot: ErrorSnapshot | null = null

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const start = performance.now()

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const latencyMs = Math.round(performance.now() - start)

    let body: unknown = null
    const contentType = response.headers.get('content-type') ?? ''
    try {
      body = contentType.includes('application/json') ? await response.json() : await response.text()
    } catch {
      body = '(could not parse response body)'
    }

    responseSnapshot = {
      status: response.status,
      statusText: response.statusText,
      latencyMs,
      headers: parseHeaders(response.headers),
      body,
    }

    if (!response.ok) {
      errorSnapshot = {
        message: `HTTP ${response.status} ${response.statusText}`,
        code: String(response.status),
        type: classifyError(null, response),
        stack: null,
      }
    }
  } catch (err) {
    clearTimeout(timeoutId)
    const latencyMs = Math.round(performance.now() - start)

    responseSnapshot = {
      status: null,
      statusText: '',
      latencyMs,
      headers: {},
      body: null,
    }

    errorSnapshot = {
      message: err instanceof Error ? err.message : String(err),
      code: null,
      type: classifyError(err),
      stack: isDev && err instanceof Error ? (err.stack ?? null) : null,
    }
  }

  result.value = {
    timestamp,
    online: navigator.onLine,
    environment: import.meta.env.MODE,
    appVersion: APP_VERSION,
    apiBaseUrl: API_BASE_URL,
    timeoutMs: TIMEOUT_MS,
    request: requestSnapshot,
    response: responseSnapshot,
    error: errorSnapshot,
  }

  running.value = false
}

onMounted(() => {
  runDiagnostic()
})

// ─── helpers for templates ───────────────────────────────────────────────────
const statusClass = computed(() => {
  const s = result.value?.response?.status
  if (!s) return 'badge--gray'
  if (s < 300) return 'badge--green'
  if (s < 400) return 'badge--blue'
  if (s < 500) return 'badge--orange'
  return 'badge--red'
})

const errorTypeLabel: Record<ErrorSnapshot['type'], string> = {
  network: '🔌 Network error (no connection / CORS)',
  timeout: '⏱️ Timeout',
  server: '🔥 Server error (5xx)',
  auth: '🔒 Authentication error (401/403)',
  unknown: '❓ Unknown',
}

function formatJson(val: unknown): string {
  try {
    return JSON.stringify(val, null, 2)
  } catch {
    return String(val)
  }
}

function formatHeaders(headers: Record<string, string>): string {
  return Object.entries(headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}
</script>

<template>
  <div class="diag-page">
    <header class="diag-header">
      <span class="diag-title">🔍 API Diagnostic</span>
      <button class="diag-btn" :disabled="running" @click="runDiagnostic">
        {{ running ? 'Running…' : '▶ Run again' }}
      </button>
    </header>

    <!-- Spinner -->
    <div v-if="running" class="diag-running">
      <span class="spinner" />
      <span>Probing <code>{{ API_BASE_URL }}</code>…</span>
    </div>

    <template v-if="result && !running">
      <!-- ── 6. Environment ──────────────────────────────────────────────── -->
      <section class="diag-card">
        <h2 class="diag-card__title">⚙️ Environment</h2>
        <table class="diag-table">
          <tbody>
            <tr>
              <td>App version</td>
              <td><code>{{ result.appVersion }}</code></td>
            </tr>
            <tr>
              <td>Mode</td>
              <td><code>{{ result.environment }}</code></td>
            </tr>
            <tr>
              <td>API base URL</td>
              <td><code>{{ result.apiBaseUrl }}</code></td>
            </tr>
            <tr>
              <td>Fallback URL</td>
              <td><code>{{ FALLBACK_URL }}</code></td>
            </tr>
            <tr>
              <td>Configured timeout</td>
              <td><code>{{ result.timeoutMs }} ms</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ── Connectivity indicators ───────────────────────────────────────── -->
      <section class="diag-card">
        <h2 class="diag-card__title">📶 Connectivity</h2>
        <table class="diag-table">
          <tbody>
            <tr>
              <td>Browser online</td>
              <td>
                <span :class="result.online ? 'badge badge--green' : 'badge badge--red'">
                  {{ result.online ? 'ONLINE' : 'OFFLINE' }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Diagnostic run at</td>
              <td><code>{{ result.timestamp }}</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ── 1. Request ─────────────────────────────────────────────────── -->
      <section class="diag-card">
        <h2 class="diag-card__title">🌐 Request</h2>
        <table class="diag-table">
          <tbody>
            <tr>
              <td>URL</td>
              <td><code>{{ result.request.url }}</code></td>
            </tr>
            <tr>
              <td>Method</td>
              <td><code>{{ result.request.method }}</code></td>
            </tr>
            <tr>
              <td>Headers sent</td>
              <td><pre>{{ formatHeaders(result.request.headers) }}</pre></td>
            </tr>
            <tr>
              <td>Query params</td>
              <td>
                <pre v-if="Object.keys(result.request.queryParams).length">{{ formatJson(result.request.queryParams) }}</pre>
                <span v-else class="diag-muted">(none)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ── 2. Response ────────────────────────────────────────────────── -->
      <section class="diag-card">
        <h2 class="diag-card__title">📡 Response</h2>
        <table class="diag-table">
          <tbody>
            <tr>
              <td>Status</td>
              <td>
                <span v-if="result.response?.status" :class="['badge', statusClass]">
                  {{ result.response.status }} {{ result.response.statusText }}
                </span>
                <span v-else class="badge badge--gray">No response</span>
              </td>
            </tr>
            <tr>
              <td>Latency</td>
              <td>
                <code v-if="result.response?.latencyMs !== null">
                  {{ result.response?.latencyMs }} ms
                </code>
                <span v-else class="diag-muted">—</span>
              </td>
            </tr>
            <tr>
              <td>Response headers</td>
              <td>
                <pre v-if="result.response && Object.keys(result.response.headers).length">{{ formatHeaders(result.response.headers) }}</pre>
                <span v-else class="diag-muted">(none)</span>
              </td>
            </tr>
            <tr>
              <td>Body</td>
              <td>
                <pre v-if="result.response?.body !== null">{{ formatJson(result.response?.body) }}</pre>
                <span v-else class="diag-muted">(empty)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ── 3. Errors ──────────────────────────────────────────────────── -->
      <section class="diag-card" :class="{ 'diag-card--ok': !result.error }">
        <h2 class="diag-card__title">❌ Errors</h2>
        <div v-if="!result.error" class="diag-ok">
          ✅ No errors detected — API responded successfully.
        </div>
        <table v-else class="diag-table">
          <tbody>
            <tr>
              <td>Error type</td>
              <td><span class="badge badge--red">{{ errorTypeLabel[result.error.type] }}</span></td>
            </tr>
            <tr>
              <td>Message</td>
              <td><code>{{ result.error.message }}</code></td>
            </tr>
            <tr v-if="result.error.code">
              <td>Code</td>
              <td><code>{{ result.error.code }}</code></td>
            </tr>
            <tr v-if="result.error.stack">
              <td>Stack trace <span class="diag-muted">(dev only)</span></td>
              <td><pre class="diag-stack">{{ result.error.stack }}</pre></td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* ── Layout ────────────────────────────────────────────────────────────────── */
.diag-page {
  min-height: 100vh;
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding: 2rem 1.5rem 4rem;
  max-width: 900px;
  margin: 0 auto;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.diag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #30363d;
}

.diag-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #58a6ff;
  letter-spacing: 0.03em;
}

.diag-btn {
  background: #21262d;
  color: #58a6ff;
  border: 1px solid #30363d;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s;
}
.diag-btn:hover:not(:disabled) {
  background: #30363d;
}
.diag-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Running indicator ───────────────────────────────────────────────────────── */
.diag-running {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: #8b949e;
  font-size: 0.9rem;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #30363d;
  border-top-color: #58a6ff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Cards ───────────────────────────────────────────────────────────────────── */
.diag-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.diag-card--ok {
  border-color: #238636;
}

.diag-card__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.65rem 1rem;
  background: #0d1117;
  border-bottom: 1px solid #30363d;
  margin: 0;
}

/* ── Table ────────────────────────────────────────────────────────────────────── */
.diag-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.diag-table td {
  padding: 0.55rem 1rem;
  vertical-align: top;
  border-bottom: 1px solid #21262d;
}

.diag-table td:first-child {
  width: 180px;
  color: #8b949e;
  white-space: nowrap;
  font-weight: 500;
}

.diag-table tr:last-child td {
  border-bottom: none;
}

/* ── Code / Pre ──────────────────────────────────────────────────────────────── */
code {
  background: #21262d;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: #e6edf3;
  word-break: break-all;
}

pre {
  background: #21262d;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.78rem;
  color: #e6edf3;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 260px;
  overflow-y: auto;
}

.diag-stack {
  color: #f85149;
  max-height: 200px;
}

/* ── Badges ──────────────────────────────────────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.badge--green  { background: #0d4429; color: #3fb950; border: 1px solid #238636; }
.badge--blue   { background: #0c2d6b; color: #58a6ff; border: 1px solid #1f6feb; }
.badge--orange { background: #341a00; color: #f0883e; border: 1px solid #9e6a03; }
.badge--red    { background: #490202; color: #f85149; border: 1px solid #da3633; }
.badge--gray   { background: #21262d; color: #8b949e; border: 1px solid #30363d; }

/* ── Misc ────────────────────────────────────────────────────────────────────── */
.diag-muted {
  color: #484f58;
  font-size: 0.8rem;
}

.diag-ok {
  padding: 1rem;
  color: #3fb950;
  font-size: 0.9rem;
}
</style>
