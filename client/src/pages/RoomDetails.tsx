import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookingsByRoomQuery } from '../features/bookings/bookings-api-slice';
import { useGetRoomsQuery } from '../features/rooms/rooms-api-slice';

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();

  const { data: rooms } = useGetRoomsQuery();
  const room = rooms?.find(r => r.id === roomId);

  const { data: bookings, isLoading, error } = useGetBookingsByRoomQuery(roomId);

  if (isLoading) return <div className="p-10 text-center">Loading schedule...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading schedule</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:underline flex items-center"
        >
          ← Back to Rooms
        </button>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{room?.name || 'Room Details'}</h1>
          <p className="text-gray-600">{room?.description}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today's Schedule</h2>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => {/* open modal or form */}}
            >
              Book this room
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500">Booked by {booking.user?.name || 'User'}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                    Confirmed
                  </span>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400 italic">
                No bookings for today yet. Be the first to book!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;