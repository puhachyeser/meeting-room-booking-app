import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { 
  useGetBookingsByRoomQuery, 
  useJoinBookingMutation, 
  useLeaveBookingMutation, 
  useDeleteBookingMutation 
} from '../features/bookings/bookings-api-slice';
import { useGetRoomsQuery } from '../features/rooms/rooms-api-slice';
import BookingModal from '../components/BookingModal';

interface RootState {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };
}

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data: rooms } = useGetRoomsQuery();
  const room = rooms?.find(r => r.id === roomId);

  const { data: bookings, isLoading, error } = useGetBookingsByRoomQuery(roomId);
  
  const [joinBooking] = useJoinBookingMutation();
  const [leaveBooking] = useLeaveBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  if (isLoading) return <div className="p-10 text-center font-medium">Loading schedule...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-medium">Error loading schedule</div>;

  const handleDelete = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId).unwrap();
      } catch (err) {
        alert('Failed to delete booking');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 transition flex items-center font-medium"
        >
          ← Back to Rooms
        </button>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{room?.name || 'Room Details'}</h1>
          <p className="text-gray-600">{room?.description}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold text-gray-800">Room Schedule</h2>
            <button 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              Book this room
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => {
                const isParticipant = booking.participants?.some(p => p.id === currentUser?.id);
                const isCreator = booking.userId === currentUser?.id;

                return (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                            Confirmed
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium">{booking.description}</p>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-gray-500">Organized by: <span className="font-semibold">{booking.user?.name}</span></p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-[10px] text-gray-400 uppercase font-bold w-full">Participants:</span>
                            {booking.participants?.map(p => (
                              <span key={p.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                                {p.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[100px]">
                        {!isParticipant ? (
                          <button 
                            onClick={() => joinBooking(booking.id)}
                            className="w-full py-1.5 text-xs font-bold bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition"
                          >
                            Join Meeting
                          </button>
                        ) : (
                          <button 
                            onClick={() => leaveBooking(booking.id)}
                            className="w-full py-1.5 text-xs font-bold bg-white text-orange-500 border border-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition"
                          >
                            Leave
                          </button>
                        )}
                        {isCreator && (
                          <button 
                            onClick={() => handleDelete(booking.id)}
                            className="w-full py-1.5 text-xs font-bold bg-white text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-16 text-center text-gray-400 italic">
                No bookings for this room yet. Be the first to book!
              </div>
            )}
          </div>
        </div>
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          roomId={roomId}
          roomName={room?.name || ''}
        />
      </div>
    </div>
  );
};

export default RoomDetails;