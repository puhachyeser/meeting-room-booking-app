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

export interface AddMemberRequest {
  roomId: number;
  email: string;
  role: 'admin' | 'user';
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
    addRoomMember: builder.mutation<void, AddMemberRequest>({
      query: ({ roomId, ...body }) => ({
        url: `/rooms/${roomId}/members`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Room'],
    }),
    deleteRoom: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation<void, { id: number; name: string; description: string }>({
      query: ({ id, ...body }) => ({
        url: `/rooms/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const { useGetRoomsQuery, useCreateRoomMutation, useAddRoomMemberMutation, useDeleteRoomMutation, useUpdateRoomMutation } = roomsApiSlice;