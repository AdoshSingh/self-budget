import axios, { AxiosInstance } from "axios";

export class ApiService {
  private client: AxiosInstance;

  constructor(baseURL?: string, timeout = 10000) {
    this.client = axios.create({
      baseURL: baseURL || "",
      timeout,
    });
  }

  async request<T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    endpoint: string,
    { body, params, headers }: { body?: any; params?: any; headers?: any } = {}
  ): Promise<T> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data: body,
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  get<T>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) {
    return this.request<T>("get", endpoint, { params, headers });
  }

  post<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>("post", endpoint, { body, headers });
  }

  put<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>("put", endpoint, { body, headers });
  }

  delete<T>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) {
    return this.request<T>("delete", endpoint, { params, headers });
  }

  patch<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>("patch", endpoint, { body, headers });
  }
}
