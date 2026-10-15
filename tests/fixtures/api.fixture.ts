import { test as base, expect } from '@playwright/test';
import { Booking, BookingClient, CreatedBooking } from '../clients/BookingClient';
import { loadJson } from '../utils/testData';

const bookings = loadJson<Booking[]>('bookings.json');

type ApiFixtures = {
  booking: BookingClient;
  createdBooking: CreatedBooking;
};

export const test = base.extend<ApiFixtures>({
  // API client built on Playwright's request context
  booking: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  // Creates a booking before the test and deletes it afterwards (clean test data).
  createdBooking: async ({ booking }, use) => {
    const response = await booking.create(bookings[0]);
    expect(response.status()).toBe(200);
    const created = (await response.json()) as CreatedBooking;
    await use(created);
    await booking.delete(created.bookingid);
  },
});

export { expect };
