import { reactive } from "vue"
import { type ApiResponse } from "../axios/axios"

export interface DashboardState {
  summary: DashboardSummary
  price: DashboardPrice
  systemStatus: DashboardSystemStatus
  mining: DashboardMining
  difficulty: DashboardDifficulty
  mempool: DashboardMempool
  fees: DashboardFees
  nextblock: DashboardNextBlock
  latestblocks: LatestBlock[]
}
export interface DashboardSummary {
  blockCount: string
  connectionsOutbound: string
  connectionsInbound: string
  syncStatus: string
  blockchainSize: string
}

export interface DashboardPrice {
  price: string
  marketCap: string
  ath: string
  declineFromAth: string
  athDate: string
}

export interface DashboardMining {
  coins: string
  blockSubsidy: string
  blocksUntilHalving: string
  halvingEstimate: string
  networkHashRate: string
}

export interface DashboardDifficulty {
  difficulty: string
  blocksToRetarget: string
  retargetDate: string
  estimatedAdjustment: string
}

export interface DashboardMempool {
  numberOfTxs: string
  minimumFee: string
  blocksToClear: string
}

export interface DashboardFees {
  immediate: string
  hour: string
  day: string
  week: string
}

export interface DashboardSystemStatus {
  cpuUsage: string
  memoryUsage: string
  temperature: string
  uptime: string
}

export interface DashboardNextBlock {
  transactions: string
  output: string
  reward: string
  totalFees: string
  medianFee: string
}

export interface LatestBlock {
  height: string
  time: string
  age: string
  ttm: string
  miner: string
  txs: string
  volume: string
  feeRates: string
  fees: string
  percentFull: string
}

export interface GlobalState {
  dashboard: DashboardState
  // more here for each view
}

export interface SSEUpdate {
  type: keyof DashboardState
  data: any
  timestamp: string
}

export class State {
  public state: GlobalState

  constructor() {
    this.state = {
      dashboard: {
        summary: {
          blockCount: "",
          connectionsOutbound: "",
          connectionsInbound: "",
          syncStatus: "",
          blockchainSize: ""
        },
        price: {
          price: "",
          marketCap: "",
          ath: "",
          declineFromAth: "",
          athDate: ""
        },
        systemStatus: {
          cpuUsage: "",
          memoryUsage: "",
          temperature: "",
          uptime: ""
        },
        mining: {
          coins: "",
          blockSubsidy: "",
          blocksUntilHalving: "",
          halvingEstimate: "",
          networkHashRate: ""
        },
        difficulty: {
          difficulty: "",
          blocksToRetarget: "",
          retargetDate: "",
          estimatedAdjustment: ""
        },
        mempool: {
          numberOfTxs: "",
          minimumFee: "",
          blocksToClear: ""
        },
        fees: {
          immediate: "",
          hour: "",
          day: "",
          week: ""
        },
        nextblock: {
          transactions: "",
          output: "",
          reward: "",
          totalFees: "",
          medianFee: ""
        },
        // not sure I really want 10 empty blocks here
        latestblocks: [
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          },
          {
            height: "",
            time: "",
            age: "",
            ttm: "",
            miner: "",
            txs: "",
            volume: "",
            feeRates: "",
            fees: "",
            percentFull: ""
          }
        ]
      }
    }
  }

  public updateDashboard<T>(update: SSEUpdate | ApiResponse<T>) {
    Object.assign(state.state.dashboard[update.type], { ...update.data })
  }

  public updateState(path: string, newState: any) {
    const stateParts = path.split(".")
    let currentLevel: any = this.state
    for (let i = 0; i < stateParts.length - 1; i++) {
      if (currentLevel[stateParts[i]] === undefined) {
        throw new Error(`Path ${path} does not exist in the state`)
      }
      currentLevel = currentLevel[stateParts[i]]
    }
    currentLevel[stateParts[stateParts.length - 1]] = newState
  }
}

export const state = reactive(new State())
