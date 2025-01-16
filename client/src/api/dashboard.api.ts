import { ref } from "vue"
import ApiService, { type ApiResponse } from "../config/api"

export const DASHBOARD = "/dashboard"
export const STREAM = "/stream"
export const SUMMARY = "/summary"
export const PRICE = "/price"
export const STATUS = "/status"
export const FEES = "/fees"
export const MINING = "/mining"
export const MEMPOOL = "/mempool"
export const DIFFICULTY = "/difficulty"
export const NEXTBLOCK = "/nextblock"
export const LATESTBLOCKS = "/latestblocks"

class DashboardApi extends ApiService {
  constructor() {
    super()
  }

  public async getAll<T>(): Promise<ApiResponse<T>[] | []> {
    try {
      const data: ApiResponse<T>[] = []
      await Promise.allSettled([
        this.get(DASHBOARD + SUMMARY),
        this.get(DASHBOARD + PRICE),
        this.get(DASHBOARD + STATUS),
        this.get(DASHBOARD + FEES),
        this.get(DASHBOARD + MINING),
        this.get(DASHBOARD + MEMPOOL),
        this.get(DASHBOARD + DIFFICULTY),
        this.get(DASHBOARD + NEXTBLOCK),
        this.get(DASHBOARD + LATESTBLOCKS)
      ]).then((results) => {
        results.forEach((res) => {
          if (res.status === "fulfilled") {
            if (res.value.status === 200) {
              data.push(res.value as ApiResponse<T>)
            }
          }
        })
      })
      return data
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
      return []
    }
  }
}

export default ref(new DashboardApi())
