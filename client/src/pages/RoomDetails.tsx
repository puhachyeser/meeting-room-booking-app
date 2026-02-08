import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { 
  useGetBookingsByRoomQuery, 
  useJoinBookingMutation, 
  useLeaveBookingMutation, 
  useDeleteBookingMutation 
} from '../features/bookings/bookings-api-slice';
import { useGetRoomsQuery, useDeleteRoomMutation } from '../features/rooms/rooms-api-slice';
import BookingModal from '../components/BookingModal';
import AddMemberModal from '../components/AddMemberModal';
import { type ApiError } from '../types/auth.types';

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
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data: rooms } = useGetRoomsQuery();
  const room = rooms?.find(r => r.id === roomId);
  const { data: bookings, isLoading, error } = useGetBookingsByRoomQuery(roomId);
  
  const [joinBooking] = useJoinBookingMutation();
  const [leaveBooking] = useLeaveBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  if (isLoading) return <div className="p-10 text-center font-medium text-gray-500">Loading schedule...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-medium">Error loading schedule</div>;

  const handleJoin = async (bookingId: number) => {
    try {
      await joinBooking(bookingId).unwrap();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || 'You cannot join this meeting.');
    }
  };

  const handleLeave = async (bookingId: number) => {
    try {
      await leaveBooking(bookingId).unwrap();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || 'Failed to leave the meeting');
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId).unwrap();
      } catch (err) {
        alert('Failed to delete booking');
        console.error(err);
      }
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('Are you sure you want to PERMANENTLY delete this room? All bookings will be lost.')) {
      try {
        await deleteRoom(roomId).unwrap();
        navigate('/');
      } catch (err) {
        const apiError = err as ApiError;
        alert(apiError.data?.message || 'Failed to delete room. Only admins can do this.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 transition flex items-center font-semibold"
        >
          ← Back to Rooms
        </button>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{room?.name || 'Room Details'}</h1>
            <p className="text-gray-500 max-w-md">{room?.description || 'No description available for this room.'}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsMemberModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-100 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all font-bold text-sm bg-white shadow-sm"
            >
              Manage Members
            </button>
            <button 
              onClick={handleDeleteRoom}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-50 text-red-500 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all font-bold text-sm bg-white shadow-sm"
            >
              Delete Room
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-800">Room Schedule</h2>
            <button 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-100 font-bold text-sm"
              onClick={() => setIsBookingModalOpen(true)}
            >
              + Book Room
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => {
                const isParticipant = booking.participants?.some(p => p.id === currentUser?.id);
                const isCreator = booking.userId === currentUser?.id;

                return (
                  <div key={booking.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-2 text-xl font-black text-gray-900 tracking-tight">
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            <span className="text-gray-400 font-normal">—</span>
                            {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                            Active
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-bold text-lg leading-tight">{booking.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Organized by <span className="text-gray-600 font-semibold">{booking.user?.name}</span>
                          </p>
                        </div>
                        <div className="pt-2">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-tighter">Participants</p>
                          <div className="flex flex-wrap gap-1.5">
                            {booking.participants?.map(p => (
                              <span key={p.id} className="px-2.5 py-1 bg-white text-gray-600 text-xs rounded-lg border border-gray-200 shadow-sm font-medium">
                                {p.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[130px]">
                        {!isParticipant ? (
                          <button 
                            onClick={() => handleJoin(booking.id)}
                            className="w-full py-2 text-xs font-black bg-white text-green-600 border-2 border-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all uppercase tracking-tight shadow-sm"
                          >
                            Join Meeting
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleLeave(booking.id)}
                            className="w-full py-2 text-xs font-black bg-white text-orange-500 border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all uppercase tracking-tight shadow-sm"
                          >
                            Leave
                          </button>
                        )}
                        {isCreator && (
                          <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="w-full py-2 text-xs font-black bg-white text-red-500 border-2 border-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-tight shadow-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-20 text-center">
                <div className="text-4xl mb-4">🗓️</div>
                <p className="text-gray-400 italic font-medium">No bookings for this room yet.</p>
                <p className="text-gray-300 text-sm mt-1">Be the first to schedule a meeting!</p>
              </div>
            )}
          </div>
        </div>
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          roomId={roomId}
          roomName={room?.name || ''}
        />
        <AddMemberModal 
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          roomId={roomId}
          roomName={room?.name || ''}
        />
      </div>
    </div>
  );
};

export default RoomDetails;