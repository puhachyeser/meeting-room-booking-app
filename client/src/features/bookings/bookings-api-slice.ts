import { apiSlice } from "../../api/api-slice";

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  startTime: string;
  endTime: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CreateBookingRequest {
  roomId: number;
  startTime: string;
  endTime: string;
  description: string;
}

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookingsByRoom: builder.query<Booking[], number>({
      query: (roomId) => ({
        url: '/bookings',
        params: { roomId },
      }),
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Booking' as const, id })), 'Booking'] 
          : ['Booking'],
    }),
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const { useGetBookingsByRoomQuery, useCreateBookingMutation } = bookingsApiSlice;