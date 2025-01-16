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
import { useSSE } from "../api/sse"
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
import { API_URL } from "../config/api"
import {
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
} from "../api/dashboard.api"

export default defineComponent({
  components: {
    DashboardSection
  },
  setup() {
    const { subscribe } = useSSE(API_URL ?? "" + DASHBOARD + STREAM)
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

    onMounted(() => {
      subscribe("update", (update: any) => {
        if (update.update) {
          state.updateDashboard(update.update)
        }
      })
    })

    return {
      fees,
      price,
      mining,
      mempool,
      summary,
      nextBlock,
      difficulty,
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
