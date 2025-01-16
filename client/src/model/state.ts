import { reactive } from "vue"
import { DashboardTypes, type ApiResponse } from "../config/api"

export interface DashboardState {
  [DashboardTypes.Summary]: DashboardSummary
  [DashboardTypes.Price]: DashboardPrice
  [DashboardTypes.SystemStatus]: DashboardSystemStatus
  [DashboardTypes.Mining]: DashboardMining
  [DashboardTypes.Difficulty]: DashboardDifficulty
  [DashboardTypes.Mempool]: DashboardMempool
  [DashboardTypes.Fees]: DashboardFees
  [DashboardTypes.Nextblock]: DashboardNextBlock
  [DashboardTypes.Latestblocks]: LatestBlock[]
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
  type: DashboardTypes
  data: any
  timestamp: string
}

export class State {
  public state: GlobalState

  constructor() {
    this.state = {
      dashboard: {
        [DashboardTypes.Summary]: {
          blockCount: "",
          connectionsOutbound: "",
          connectionsInbound: "",
          syncStatus: "",
          blockchainSize: ""
        },
        [DashboardTypes.Price]: {
          price: "",
          marketCap: "",
          ath: "",
          declineFromAth: "",
          athDate: ""
        },
        [DashboardTypes.SystemStatus]: {
          cpuUsage: "",
          memoryUsage: "",
          temperature: "",
          uptime: ""
        },
        [DashboardTypes.Mining]: {
          coins: "",
          blockSubsidy: "",
          blocksUntilHalving: "",
          halvingEstimate: "",
          networkHashRate: ""
        },
        [DashboardTypes.Difficulty]: {
          difficulty: "",
          blocksToRetarget: "",
          retargetDate: "",
          estimatedAdjustment: ""
        },
        [DashboardTypes.Mempool]: {
          numberOfTxs: "",
          minimumFee: "",
          blocksToClear: ""
        },
        [DashboardTypes.Fees]: {
          immediate: "",
          hour: "",
          day: "",
          week: ""
        },
        [DashboardTypes.Nextblock]: {
          transactions: "",
          output: "",
          reward: "",
          totalFees: "",
          medianFee: ""
        },
        // not sure I really want 10 empty blocks here
        [DashboardTypes.Latestblocks]: [
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
    Object.assign(this.state.dashboard[update.type], { ...update.data })
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
