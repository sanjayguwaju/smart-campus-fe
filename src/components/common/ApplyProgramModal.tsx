import React, { useState } from 'react';
import { Program } from '../../api/types/programs';
import { programService } from '../../api/services/programService';

interface ApplyProgramModalProps {
  open: boolean;
  onClose: () => void;
  program: Program | null;
  onSuccess?: () => void;
}

const ApplyProgramModal: React.FC<ApplyProgramModalProps> = ({ open, onClose, program, onSuccess }) => {
  const [campusId, setCampusId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open || !program) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log('Submitting application:', { program: program?._id, studentId: campusId });
      await programService.submitProgramApplication({
        program: program._id,
        studentId: campusId, // changed from campusId to studentId
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCampusId('');
    setError(null);
    setSuccess(false);
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
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Apply to {program.name}</h2>
        {success ? (
          <div className="text-green-700 font-semibold text-center mb-4">Application submitted! Status: Pending.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={campusId}
                onChange={e => setCampusId(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {/* Optional: Add document upload here */}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || !campusId}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyProgramModal; 