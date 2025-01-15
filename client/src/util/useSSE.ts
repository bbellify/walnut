import { ref, onMounted, onUnmounted } from "vue"
import { SSEService } from "../model/sse.service"

export function useSSE(url: string) {
  const sseService = ref(new SSEService(url))
  const isConnected = ref(false)

  onMounted(() => {
    sseService.value.connect()
    isConnected.value = true
  })

  onUnmounted(() => {
    sseService.value.disconnect()
    isConnected.value = false
  })

  return {
    subscribe: sseService.value.subscribe.bind(sseService.value),
    isConnected
  }
}
