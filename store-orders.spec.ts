import { OrderService } from '../../utils/order.service';
import { orderFixtures, Order } from '../../fixtures/api.fixtures';

/**
 * Petstore API – /store/order tests
 *
 * Strategy: create an order once per describe block when state is needed,
 * then exercise get / delete on that known ID.
 */
describe('Petstore API – Store Orders', () => {
  // Shared state across tests in "CRUD lifecycle" suite
  let createdOrderId: number;
  const baseOrder = { ...orderFixtures.validOrder };

  // ─── GET Order ───────────────────────────────────────────────────────────────

  describe('GET /store/order/{orderId}', () => {
    beforeAll(async () => {
      // Create a fresh order to fetch
      const res = await OrderService.create(baseOrder);
      createdOrderId = res.data.id;
    });

    test('TC-API-01 | Returns HTTP 200 for an existing order', async () => {
      const res = await OrderService.getById(createdOrderId);
      expect(res.status).toBe(200);
    });

    test('TC-API-02 | Response body contains expected schema', async () => {
      const res = await OrderService.getById(createdOrderId);
      const order: Order = res.data;

      expect(order).toMatchObject({
        id: expect.any(Number),
        petId: expect.any(Number),
        quantity: expect.any(Number),
        status: expect.stringMatching(/^(placed|approved|delivered)$/),
        complete: expect.any(Boolean),
      });
      expect(order.id).toBe(createdOrderId);
    });

    test('TC-API-03 | Returns HTTP 404 for a non-existent order', async () => {
      expect.assertions(1);
      try {
        await OrderService.getById(orderFixtures.invalidOrderId);
      } catch (err: any) {
        expect(err.response.status).toBe(404);
      }
    });

    test('TC-API-04 | Order status matches what was submitted', async () => {
      const res = await OrderService.getById(createdOrderId);
      expect(res.data.status).toBe(baseOrder.status);
    });
  });

  // ─── POST Order ──────────────────────────────────────────────────────────────

  describe('POST /store/order', () => {
    test('TC-API-05 | Creating an order returns HTTP 200', async () => {
      const res = await OrderService.create(baseOrder);
      expect(res.status).toBe(200);
    });

    test('TC-API-06 | Response contains a numeric id assigned by the server', async () => {
      const res = await OrderService.create(baseOrder);
      expect(res.data.id).toEqual(expect.any(Number));
      expect(res.data.id).toBeGreaterThan(0);
    });

    test('TC-API-07 | Created order reflects the submitted petId and quantity', async () => {
      const payload = { ...baseOrder, petId: 7, quantity: 3 };
      const res = await OrderService.create(payload);
      expect(res.data.petId).toBe(7);
      expect(res.data.quantity).toBe(3);
    });

    test('TC-API-08 | Created order has status "placed"', async () => {
      const res = await OrderService.create({ ...baseOrder, status: 'placed' });
      expect(res.data.status).toBe('placed');
    });

    test('TC-API-09 | complete flag is reflected in response', async () => {
      const res = await OrderService.create({ ...baseOrder, complete: false });
      expect(res.data.complete).toBe(false);
    });
  });

  // ─── DELETE Order ─────────────────────────────────────────────────────────────

  describe('DELETE /store/order/{orderId}', () => {
    let orderToDeleteId: number;

    beforeEach(async () => {
      // Create a fresh order for each delete test to keep them independent
      const res = await OrderService.create(baseOrder);
      orderToDeleteId = res.data.id;
    });

    test('TC-API-10 | Deleting an existing order returns HTTP 200', async () => {
      const res = await OrderService.delete(orderToDeleteId);
      expect(res.status).toBe(200);
    });

    test('TC-API-11 | Deleted order is no longer retrievable (HTTP 404)', async () => {
      await OrderService.delete(orderToDeleteId);

      expect.assertions(1);
      try {
        await OrderService.getById(orderToDeleteId);
      } catch (err: any) {
        expect(err.response.status).toBe(404);
      }
    });

    test('TC-API-12 | Deleting a non-existent order returns HTTP 404', async () => {
      expect.assertions(1);
      try {
        await OrderService.delete(orderFixtures.invalidOrderId);
      } catch (err: any) {
        expect(err.response.status).toBe(404);
      }
    });
  });

  // ─── Inventory (bonus endpoint) ───────────────────────────────────────────────

  describe('GET /store/inventory (bonus)', () => {
    test('TC-API-13 | Inventory endpoint returns HTTP 200', async () => {
      const res = await OrderService.getInventory();
      expect(res.status).toBe(200);
    });

    test('TC-API-14 | Inventory is a map of string → number', async () => {
      const res = await OrderService.getInventory();
      const inventory = res.data;
      expect(typeof inventory).toBe('object');
      Object.values(inventory).forEach((count) => {
        expect(typeof count).toBe('number');
      });
    });
  });
});
