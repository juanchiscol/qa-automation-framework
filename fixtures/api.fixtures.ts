export const orderFixtures = {
  validOrder: {
    id: 0, // Will be assigned by the server or overridden in tests
    petId: 10,
    quantity: 2,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: true,
  },
  invalidOrderId: 999999999,
  statuses: ['placed', 'approved', 'delivered'] as const,
};

export type OrderStatus = typeof orderFixtures.statuses[number];

export interface Order {
  id: number;
  petId: number;
  quantity: number;
  shipDate: string;
  status: OrderStatus;
  complete: boolean;
}
