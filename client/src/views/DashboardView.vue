<template>
  <div class="fade main">
    <DashboardSection :name="'Summary'" :data="summary" :url="SUMMARY" />
    <DashboardSection :name="'Price'" :data="price" :url="PRICE" />
    <DashboardSection :name="'System Status'" :data="systemStatus" :url="STATUS" />
    <DashboardSection :name="'Fees'" :data="fees" :url="FEES" />
    <DashboardSection :name="'Mining'" :data="mining" :url="MINING" />
    <DashboardSection :name="'Mempool'" :data="mempool" :url="MEMPOOL" />
    <DashboardSection :name="'Difficulty'" :data="difficulty" :url="DIFFICULTY" />
    <DashboardSection :name="'Next Block'" :data="nextBlock" :url="NEXTBLOCK" />
    <DashboardSection :name="'Latest Blocks'" :tableData="latestBlocks" :url="LATESTBLOCKS" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, type Ref } from "vue"
import { mockBlocks } from "../util/mockData"
import { useSSE } from "../util/useSSE"
import {
  state,
  type DashboardDifficulty,
  type DashboardFees,
  type DashboardMempool,
  type DashboardMining,
  type DashboardNextBlock,
  type DashboardSummary,
  type DashboardSystemStatus,
  type DashboardPrice,
  type LatestBlock
} from "../model/state"
import DashboardSection from "../components/dashboard/DashboardSection.vue"
import api, {
  API_URL,
  DASHBOARD,
  STREAM,
  SUMMARY,
  PRICE,
  STATUS,
  FEES,
  MINING,
  MEMPOOL,
  DIFFICULTY,
  NEXTBLOCK,
  LATESTBLOCKS
} from "../axios/axios"

export default defineComponent({
  components: {
    DashboardSection
  },
  setup() {
    const { subscribe } = useSSE(API_URL + DASHBOARD + STREAM)
    const summary: Ref<DashboardSummary> = computed(() => state.state.dashboard.summary)
    const price: Ref<DashboardPrice> = computed(() => state.state.dashboard.price)
    const systemStatus: Ref<DashboardSystemStatus> = computed(
      () => state.state.dashboard.systemStatus
    )
    const mining: Ref<DashboardMining> = computed(() => state.state.dashboard.mining)
    const difficulty: Ref<DashboardDifficulty> = computed(() => state.state.dashboard.difficulty)
    const mempool: Ref<DashboardMempool> = computed(() => state.state.dashboard.mempool)
    const fees: Ref<DashboardFees> = computed(() => state.state.dashboard.fees)
    const nextBlock: Ref<DashboardNextBlock> = computed(() => state.state.dashboard.nextblock)
    const latestBlocks: Ref<LatestBlock[]> = computed(() => state.state.dashboard.latestblocks)

    onMounted(async () => {
      try {
        await Promise.allSettled([
          api.get(DASHBOARD + SUMMARY),
          api.get(DASHBOARD + PRICE),
          api.get(DASHBOARD + STATUS),
          api.get(DASHBOARD + FEES),
          api.get(DASHBOARD + MINING),
          api.get(DASHBOARD + MEMPOOL),
          api.get(DASHBOARD + DIFFICULTY),
          api.get(DASHBOARD + NEXTBLOCK),
          api.get(DASHBOARD + LATESTBLOCKS)
        ]).then((results) => {
          results.forEach((res) => {
            if (res.status === "fulfilled") {
              if (res.value.status === 200) {
                console.log(`${res.value.type} request successful`)
                state.updateDashboard(res.value)
              } else {
                console.log(`${res.value.type} request failed, error: ${res.value?.errors}`)
              }
            } else {
              console.log(`request failed with unknown error: ${res}`)
            }
          })
        })

        subscribe("update", (update: any) => {
          if (update.update) {
            state.updateDashboard(update.update)
          }
        })
      } catch (error) {
        console.error("Failed to fetch initial data:", error)
      }
    })

    return {
      fees,
      price,
      mining,
      mempool,
      summary,
      nextBlock,
      difficulty,
      mockBlocks,
      latestBlocks,
      systemStatus,
      STREAM,
      SUMMARY,
      PRICE,
      STATUS,
      FEES,
      MINING,
      MEMPOOL,
      DIFFICULTY,
      NEXTBLOCK,
      LATESTBLOCKS
    }
  }
})
</script>

<style scoped lang="css">
.main {
  display: flex;
  flex-wrap: wrap;
}
</style>
