import { ref, onMounted, onUnmounted } from "vue"
import { API_URL } from "../config/api"
import { DASHBOARD, STREAM } from "./dashboard.api"

class SSEService {
  eventSource: EventSource | null = null
  private listeners: Map<string, ((data: any) => void)[]> = new Map()
  private retryCount = 0
  private readonly baseDelay = 1000
  private readonly maxRetries = 10

  // Watchdog: if no traffic (data update or heartbeat) arrives within this
  // window, assume the connection is silently dead (half-open) and reconnect.
  // The server heartbeats every 15s, so this tolerates ~1 missed beat.
  private readonly staleTimeout = 35000
  private watchdogTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private manualClose = false

  constructor(private url: string) {}

  connect() {
    // Tear down any existing connection/timers before opening a new one.
    this.cleanup()
    this.manualClose = false

    this.eventSource = new EventSource(this.url)

    this.eventSource.onmessage = (event) => {
      this.recordActivity()
      const data = JSON.parse(event.data)
      this.notifyListeners("update", data)
      console.log(
        `SSE ${data.update?.type ? data.update?.type + " " : ""}update received at ` +
          new Date().toLocaleString()
      )
    }

    // Heartbeat: keeps the watchdog satisfied without touching the data path.
    this.eventSource.addEventListener("ping", () => {
      this.recordActivity()
    })

    this.eventSource.onopen = () => {
      console.log("SSE opened")
      this.retryCount = 0 // Reset retry count on successful connection
      this.recordActivity()
    }

    this.eventSource.onerror = (err) => {
      console.error("EventSource failed:", err)
      this.scheduleReconnect()
    }
  }

  disconnect() {
    this.manualClose = true
    this.cleanup()
    console.log("SSE closed")
  }

  get isOpen() {
    return !!this.eventSource && this.eventSource.readyState === EventSource.OPEN
  }

  // Reset the watchdog every time we hear from the server. If the timer ever
  // fires, the stream has gone silent and we force a reconnect.
  private recordActivity() {
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer)
    this.watchdogTimer = setTimeout(() => {
      this.watchdogTimer = null
      console.warn("SSE watchdog: no activity, forcing reconnect")
      // readyState may still report OPEN here (half-open connection); reconnect
      // regardless rather than trusting it.
      this.scheduleReconnect()
    }, this.staleTimeout)
  }

  private scheduleReconnect() {
    if (this.manualClose) return
    if (this.reconnectTimer) return // a reconnect is already pending

    this.closeEventSource()
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer)
      this.watchdogTimer = null
    }

    // Exponential backoff retry
    const delay = Math.min(this.baseDelay * Math.pow(2, this.retryCount), 30000)
    this.retryCount = Math.min(this.retryCount + 1, this.maxRetries)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  private closeEventSource() {
    if (this.eventSource) {
      this.eventSource.onopen = null
      this.eventSource.onmessage = null
      this.eventSource.onerror = null
      this.eventSource.close()
      this.eventSource = null
    }
  }

  private cleanup() {
    this.closeEventSource()
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer)
      this.watchdogTimer = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
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

  const updateConnectionStatus = () => {
    isConnected.value = dashboardSSE.isOpen
  }

  // After a background-tab freeze or a laptop sleep, the EventSource is often
  // stuck reporting OPEN while the underlying connection is dead. Reconnect
  // unconditionally on regaining focus rather than trusting readyState.
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log("Tab visible again - reconnecting SSE")
      dashboardSSE.connect()
      updateConnectionStatus()
    }
  }

  const handleOnline = () => {
    console.log("Network online - reconnecting SSE")
    dashboardSSE.connect()
    updateConnectionStatus()
  }

  onMounted(() => {
    if (dashboardSSECount === 0) {
      dashboardSSE.connect()
      updateConnectionStatus()
    }
    dashboardSSECount++

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("online", handleOnline)
  })

  onUnmounted(() => {
    dashboardSSECount--
    if (dashboardSSECount === 0) {
      dashboardSSE.disconnect()
      updateConnectionStatus()
    }

    document.removeEventListener("visibilitychange", handleVisibilityChange)
    window.removeEventListener("online", handleOnline)
  })

  return {
    subscribe: dashboardSSE.subscribe.bind(dashboardSSE),
    isConnected
  }
}
