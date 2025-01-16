import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from "axios"

export const API_URL: string = import.meta.env.VITE_API_URL

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  type: DashboardTypes
  errors?: Array<{ field: string; message: string }>
}

export enum DashboardTypes {
  // corresponds to each Dashboard section
  Summary = "summary",
  Price = "price",
  SystemStatus = "systemStatus",
  Mining = "mining",
  Difficulty = "difficulty",
  Mempool = "mempool",
  Fees = "fees",
  Nextblock = "nextblock",
  Latestblocks = "latestblocks"
}

export default class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    const config = {
      baseURL: API_URL ?? "",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      }
    }

    this.axiosInstance = axios.create(config)

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, { params })
    if (response.status !== 200) {
      throw new Error(response.data.message || "API request failed")
    }
    return response.data
  }

  private handleError(error: AxiosError) {
    console.error("API Error:", error.message)
  }
}
