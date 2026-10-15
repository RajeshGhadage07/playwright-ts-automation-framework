import { test, expect } from '../fixtures/api.fixture';
import { Booking } from '../clients/BookingClient';
import { loadJson } from '../utils/testData';

const bookings = loadJson<Booking[]>('bookings.json');

test.describe('Booking API', () => {
  test('booking list returns booking ids', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/booking');
    expect(response.status()).toBe(200);
    const list = await response.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('bookingid');
  });

  test('created booking can be fetched by id', { tag: '@smoke' }, async ({ booking, createdBooking }) => {
    const response = await booking.get(createdBooking.bookingid);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(createdBooking.booking);
  });

  // Data-driven: one test per booking in test-data/bookings.json
  for (const data of bookings) {
    test(`create booking - ${data.firstname} ${data.lastname}`, { tag: '@regression' }, async ({ booking }) => {
      const response = await booking.create(data);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.bookingid).toBeGreaterThan(0);
      expect(body.booking).toMatchObject(data);
      await booking.delete(body.bookingid); // clean up
    });
  }

  test('full update (PUT) changes the booking', { tag: '@regression' }, async ({ booking, createdBooking }) => {
    const updated: Booking = { ...createdBooking.booking, firstname: 'Updated', totalprice: 9999 };
    const response = await booking.update(createdBooking.bookingid, updated);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Updated');
    expect(body.totalprice).toBe(9999);
  });

  test('partial update (PATCH) changes only the given field', { tag: '@regression' }, async ({ booking, createdBooking }) => {
    const response = await booking.partialUpdate(createdBooking.bookingid, { firstname: 'Patched' });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Patched');
    expect(body.lastname).toBe(createdBooking.booking.lastname);
  });

  test('deleted booking cannot be fetched', { tag: '@regression' }, async ({ booking, createdBooking }) => {
    const deleteResponse = await booking.delete(createdBooking.bookingid);
    expect(deleteResponse.status()).toBe(201); // Restful-Booker returns 201 for a successful delete
    const getResponse = await booking.get(createdBooking.bookingid);
    expect(getResponse.status()).toBe(404);
  });

  test('unknown booking id returns 404', { tag: '@regression' }, async ({ booking }) => {
    const response = await booking.get(99999999);
    expect(response.status()).toBe(404);
  });
});
