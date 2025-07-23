import React, { useState } from 'react';

interface RejectApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

const RejectApplicationModal: React.FC<RejectApplicationModalProps> = ({ open, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Rejection reason is required.');
      return;
    }
    setError(null);
    onConfirm(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-red-700">Reject Application</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter rejection reason:</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
          rows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
          disabled={loading}
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectApplicationModal; 