import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../config/api';
import AdminNavbar from '../../components/AdminNavbar';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const response = await api.get('/api/feedback/list');
      if (response.data.success) setFeedback(response.data.feedback);
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedback(); }, []);

  const updateStatus = async (feedbackId, status) => {
    const response = await api.post('/api/feedback/status', { feedbackId, status });
    if (response.data.success) {
      toast.success(`Feedback ${status}`);
      fetchFeedback();
    } else {
      toast.error(response.data.message || 'Unable to update feedback');
    }
  };

  const removeFeedback = async (feedbackId) => {
    if (!window.confirm('Remove this feedback?')) return;
    const response = await api.post('/api/feedback/remove', { feedbackId });
    if (response.data.success) {
      toast.success('Feedback removed');
      fetchFeedback();
    }
  };

  if (loading) return <div className='flex min-h-screen items-center justify-center'>Loading feedback...</div>;

  return (
    <div className='min-h-screen bg-gray-50'>
      <AdminNavbar />
      <main className='mx-auto max-w-7xl px-4 pb-12 pt-[108px] sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Feedback Management</h1>
          <p className='mt-2 text-gray-600'>Review customer feedback before publication</p>
        </div>
        {feedback.length === 0 ? (
          <div className='rounded-2xl border bg-white py-16 text-center text-gray-500'>No feedback submitted</div>
        ) : (
          <div className='grid gap-5 md:grid-cols-2'>
            {feedback.map((item) => (
              <article key={item._id} className='rounded-2xl border border-gray-200 bg-white p-6'>
                <div className='mb-4 flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    {item.profilePicture && <img src={item.profilePicture} alt='' className='h-12 w-12 rounded-full object-cover' />}
                    <div>
                      <h2 className='font-bold text-gray-900'>{item.name}</h2>
                      <p className='text-sm text-[#b4935f]'>{'★'.repeat(item.rating)}</p>
                    </div>
                  </div>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold'>{item.status}</span>
                </div>
                <p className='mb-5 text-sm leading-6 text-gray-600'>{item.message}</p>
                <div className='flex flex-wrap gap-2'>
                  {item.status !== 'approved' && <button onClick={() => updateStatus(item._id, 'approved')} className='rounded-full bg-green-700 px-4 py-2 text-xs font-bold text-white'>Approve</button>}
                  {item.status !== 'rejected' && <button onClick={() => updateStatus(item._id, 'rejected')} className='rounded-full border px-4 py-2 text-xs font-bold'>Reject</button>}
                  <button onClick={() => removeFeedback(item._id)} className='rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-600'>Remove</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminFeedback;
