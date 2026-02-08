import { useState, useEffect } from 'react';
import { useUpdateRoomMutation } from '../features/rooms/rooms-api-slice';
import { type ApiError } from '../types/auth.types';

interface Props {
  room: {
    id: number;
    name: string;
    description: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const EditRoomModal = ({ room, isOpen, onClose }: Props) => {
  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description);
  const [updateRoom, { isLoading }] = useUpdateRoomMutation();

  useEffect(() => {
    setName(room.name);
    setDescription(room.description);
  }, [room]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRoom({ id: room.id, name, description }).unwrap();
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || 'Failed to update room');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
          <h3 className="font-bold">Edit Room Details</h3>
          <button onClick={onClose} className="text-2xl leading-none hover:text-blue-200 transition">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Room Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 text-gray-600 font-semibold border rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;