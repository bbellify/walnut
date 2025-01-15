export class SSEService {
  private eventSource: EventSource | null = null
  private listeners: Map<string, ((data: any) => void)[]> = new Map()

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

    this.eventSource.onerror = () => {
      console.error("EventSource failed.")
      this.eventSource?.close()
      this.eventSource = null
    }

    this.eventSource.onopen = () => {
      console.log("SSE opened")
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
