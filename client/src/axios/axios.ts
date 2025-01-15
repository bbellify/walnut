import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from "axios"
import { type DashboardState } from "../model/state"

export const API_URL: string = import.meta.env.VITE_API_URL
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

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  type: keyof DashboardState
  errors?: Array<{ field: string; message: string }>
}

class ApiService {
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

export default new ApiService()
