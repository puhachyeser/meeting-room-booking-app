import { useState } from 'react';
import { useAddRoomMemberMutation } from '../features/rooms/rooms-api-slice';
import { type ApiError } from '../types/auth.types';

interface Props {
  roomId: number;
  roomName: string;
  isOpen: boolean;
  onClose: () => void;
}

const AdduserModal = ({ roomId, roomName, isOpen, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [adduser, { isLoading }] = useAddRoomMemberMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adduser({ roomId, email, role }).unwrap();
      alert('User added successfully!');
      setEmail('');
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-800 text-white">
          <h3 className="font-bold">Add to {roomName}</h3>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="colleague@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="w-full p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User (View & Join)</option>
              <option value="admin">Admin (Full Control)</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2 text-gray-600 font-semibold border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdduserModal;