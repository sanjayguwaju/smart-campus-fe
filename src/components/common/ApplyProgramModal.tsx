import React, { useState } from 'react';
import { Program } from '../../api/types/programs';
import { programService } from '../../api/services/programService';
import ImageUpload from './ImageUpload';
import { toast } from 'react-hot-toast';

interface ApplyProgramModalProps {
  open: boolean;
  onClose: () => void;
  program: Program | null;
  onSuccess?: () => void;
}

const ApplyProgramModal: React.FC<ApplyProgramModalProps> = ({ open, onClose, program, onSuccess }) => {
  const [campusId, setCampusId] = useState('');
  const [idCardUrl, setIdCardUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open || !program) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!idCardUrl) {
      setError('ID Card image is required.');
      setLoading(false);
      return;
    }
    try {
      await programService.submitProgramApplication({
        program: program._id,
        studentId: campusId, // campusId for admin reference
        idCardUrl,
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to submit application';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCampusId('');
    setIdCardUrl('');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College ID Card <span className="text-red-500">*</span></label>
              <ImageUpload
                onImageUpload={setIdCardUrl}
                currentImage={idCardUrl}
                className="w-full h-40"
                disabled={loading}
              />
              {!idCardUrl && <div className="text-red-500 text-xs mt-1">ID card image is required.</div>}
            </div>
            {error && <div className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded p-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || !campusId || !idCardUrl}
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