import type { APIRoutes } from '#extensions/routes-types'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

export const multipartHeaders = {
  headers: { 'Content-Type': 'multipart/form-data' },
}

class ApiClient {
  private client: AxiosInstance

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create(config)
  }

  // GET method
  get<T>(url: APIRoutes['GET'], config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config)
  }

  // POST method
  post<T>(url: APIRoutes['POST'], data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config)
  }

  // PUT method
  put<T>(url: APIRoutes['PUT'], data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config)
  }

  // DELETE method
  delete<T>(url: APIRoutes['DELETE'], config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config)
  }
}

const api = new ApiClient({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'X-Device-Type': 'web',
    Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
})

export default api
