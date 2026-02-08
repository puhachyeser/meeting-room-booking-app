import { useGetRoomsQuery } from '../features/rooms/rooms-api-slice';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/auth-slice';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const { data: rooms, isLoading, error } = useGetRoomsQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  if (isLoading) return <div className="text-center p-10 font-semibold text-gray-600">Loading rooms...</div>;
  
  if (error) {
    return (
      <div className="text-center p-10 text-red-500 font-semibold">
        Error loading rooms. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Available Rooms</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
          >
            Log Out
          </button>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <div 
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition cursor-pointer group flex flex-col justify-between h-48"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {room.name}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {room.description || 'No description provided.'}
                </p>
              </div>
              <div className="mt-4 text-blue-500 font-bold text-sm flex items-center">
                View Schedule 
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
          <button 
            onClick={() => navigate('/create-room')}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition h-48 bg-transparent"
          >
            <span className="text-4xl mb-1 font-light">+</span>
            <span className="font-medium">Add New Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rooms;