import { APIRequestContext, APIResponse } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

/** Reusable client for the Restful-Booker API (token handling + CRUD calls). */
export class BookingClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async getToken(): Promise<string> {
    if (!this.token) {
      const response = await this.request.post('/auth', {
        data: {
          username: process.env.API_USERNAME ?? 'admin',
          password: process.env.API_PASSWORD ?? 'password123',
        },
      });
      const body = await response.json();
      this.token = body.token as string;
    }
    return this.token;
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async update(id: number, booking: Booking): Promise<APIResponse> {
    const token = await this.getToken();
    return this.request.put(`/booking/${id}`, { data: booking, headers: { Cookie: `token=${token}` } });
  }

  async partialUpdate(id: number, fields: Partial<Booking>): Promise<APIResponse> {
    const token = await this.getToken();
    return this.request.patch(`/booking/${id}`, { data: fields, headers: { Cookie: `token=${token}` } });
  }

  async delete(id: number): Promise<APIResponse> {
    const token = await this.getToken();
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}
