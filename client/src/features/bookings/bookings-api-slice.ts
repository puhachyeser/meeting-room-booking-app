import { apiSlice } from "../../api/api-slice";

export interface Participant {
  id: number;
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  description: string;
  startTime: string;
  endTime: string;
  user?: {
    name: string;
    email: string;
  };
  participants: Participant[];
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
    joinBooking: builder.mutation<void, number>({
    query: (id) => ({
        url: `/bookings/${id}/join`,
        method: 'POST',
    }),
    invalidatesTags: ['Booking'],
    }),
    leaveBooking: builder.mutation<void, number>({
    query: (id) => ({
        url: `/bookings/${id}/leave`,
        method: 'POST',
    }),
    invalidatesTags: ['Booking'],
    }),
    deleteBooking: builder.mutation<void, number>({
    query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
    }),
    invalidatesTags: ['Booking', 'Room'],
    }),
  }),
});

export const { useGetBookingsByRoomQuery, useCreateBookingMutation, useJoinBookingMutation, useLeaveBookingMutation, useDeleteBookingMutation } = bookingsApiSlice;