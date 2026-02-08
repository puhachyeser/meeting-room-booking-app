import { useForm } from 'react-hook-form';
import { useCreateBookingMutation } from '../features/bookings/bookings-api-slice';
import { type ApiError } from '../types/auth.types';

interface BookingFields {
  date: string;
  start: string;
  end: string;
  description: string;
}

interface Props {
  roomId: number;
  roomName: string;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ roomId, roomName, isOpen, onClose }: Props) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<BookingFields>();
  
  const [createBooking, { isLoading }] = useCreateBookingMutation();

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: BookingFields) => {
    try {
      const startTime = new Date(`${data.date}T${data.start}`).toISOString();
      const endTime = new Date(`${data.date}T${data.end}`).toISOString();

      await createBooking({ 
        roomId, 
        startTime, 
        endTime,
        description: data.description
      }).unwrap();
      
      reset();
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || 'Conflict: Time slot is taken');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Book {roomName}</h3>
          <button onClick={onClose} className="text-3xl leading-none hover:text-gray-200 transition">&times;</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              min={today}
              {...register('date', { required: 'Date is required' })}
              className={`w-full p-2.5 rounded-lg border outline-none transition ${
                errors.date ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
              <input 
                type="time" 
                {...register('start', { required: 'Required' })} 
                className="w-full p-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
              <input 
                type="time" 
                {...register('end', { required: 'Required' })} 
                className="w-full p-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              {...register('description', { 
                required: 'Please provide a description for the meeting',
                minLength: { value: 3, message: 'Description is too short' }
              })}
              placeholder="What is this meeting about?"
              className={`w-full p-2.5 rounded-lg border outline-none transition ${
                errors.description ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              }`}
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 text-gray-600 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 shadow-md"
            >
              {isLoading ? 'Booking...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;