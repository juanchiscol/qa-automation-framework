import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { ENV } from '../config/env.js';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10_000,
    });

    // Request interceptor for logging
    this.client.interceptors.request.use((config) => {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`[API] Error ${error.response?.status}: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.get<T>(path, { params });
  }

  async post<T>(path: string, body: unknown): Promise<AxiosResponse<T>> {
    return this.client.post<T>(path, body);
  }

  async put<T>(path: string, body: unknown): Promise<AxiosResponse<T>> {
    return this.client.put<T>(path, body);
  }

  async delete<T>(path: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(path);
  }
}

export const petstoreClient = new ApiClient(ENV.api.petstoreUrl);
