import { petstoreClient } from './api.client.js';
import type { Order } from '../fixtures/api.fixtures.js';
import type { AxiosResponse } from 'axios';

const OrderService = {
  /**
   * GET /store/order/{orderId}
   */
  async getById(orderId: number): Promise<AxiosResponse<Order>> {
    return petstoreClient.get<Order>(`/store/order/${orderId}`);
  },

  /**
   * POST /store/order
   */
  async create(order: Partial<Order>): Promise<AxiosResponse<Order>> {
    return petstoreClient.post<Order>('/store/order', order);
  },

  /**
   * DELETE /store/order/{orderId}
   */
  async delete(orderId: number): Promise<AxiosResponse<{ code: number; type: string; message: string }>> {
    return petstoreClient.delete(`/store/order/${orderId}`);
  },

  /**
   * GET /store/inventory
   */
  async getInventory(): Promise<AxiosResponse<Record<string, number>>> {
    return petstoreClient.get<Record<string, number>>('/store/inventory');
  },
};

module.exports = { OrderService };
