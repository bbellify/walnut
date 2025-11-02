import { ref, onMounted, onUnmounted } from "vue"
import { API_URL } from "../config/api"
import { DASHBOARD, STREAM } from "./dashboard.api"

class SSEService {
  private eventSource: EventSource | null = null
  private listeners: Map<string, ((data: any) => void)[]> = new Map()
  private retryCount = 0
  private readonly baseDelay = 1000
  private readonly maxRetries = 10

  constructor(private url: string) {}

  connect() {
    this.eventSource = new EventSource(this.url)

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.notifyListeners("update", data)
      console.log(
        `SSE ${data.update?.type ? data.update?.type + " " : ""}update received at ` +
          new Date().toLocaleString()
      )
    }

    this.eventSource.onerror = (err) => {
      console.error("EventSource failed:", err)
      this.eventSource?.close()
      this.eventSource = null

      // Exponential backoff retry
      const delay = Math.min(this.baseDelay * Math.pow(2, this.retryCount), 30000)
      this.retryCount = Math.min(this.retryCount + 1, this.maxRetries)
      setTimeout(() => this.connect(), delay)
    }

    this.eventSource.onopen = () => {
      console.log("SSE opened")
      this.retryCount = 0 // Reset retry count on successful connection
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      console.log("SSE closed")
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)?.push(callback)
  }

  private notifyListeners(eventType: string, data: any) {
    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      callbacks.forEach((cb) => cb(data))
    }
  }
}

const dashboardSSE = new SSEService((API_URL ?? "") + DASHBOARD + STREAM)
let dashboardSSECount = 0

export function useDashboardSSE() {
  const isConnected = ref(false)

  onMounted(() => {
    if (dashboardSSECount === 0) {
      dashboardSSE.connect()
      isConnected.value = true
    }
    dashboardSSECount++
  })

  onUnmounted(() => {
    dashboardSSECount--
    if (dashboardSSECount === 0) {
      dashboardSSE.disconnect()
    }
  })

  return {
    subscribe: dashboardSSE.subscribe.bind(dashboardSSE),
    isConnected
  }
}
