import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateRoomMutation } from '../features/rooms/rooms-api-slice';

interface CreateRoomFields {
  name: string;
  description: string;
}

const CreateRoom = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateRoomFields>();
  const [createRoom, { isLoading }] = useCreateRoomMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: CreateRoomFields) => {
    try {
      await createRoom(data).unwrap();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to create room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">New Meeting Room</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Conference Hall A"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Projectors, 10 seats, whiteboard..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;