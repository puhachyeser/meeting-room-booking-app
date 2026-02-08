import { apiSlice } from "../../api/api-slice";

export interface Room {
  id: number;
  name: string;
  description: string;
}

export interface RoomsApiError {
  data: {
    message: string;
  };
  status: number;
}

export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => '/rooms',
      providesTags: ['Room'],
    }),
    createRoom: builder.mutation<Room, Partial<Room>>({
      query: (body) => ({
        url: '/rooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const { useGetRoomsQuery, useCreateRoomMutation } = roomsApiSlice;