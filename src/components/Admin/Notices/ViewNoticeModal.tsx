import React from 'react';
import { Notice } from '../../api/types/notices';

interface ViewNoticeModalProps {
  isOpen: boolean;
  notice: Notice | null;
  onClose: () => void;
}

const ViewNoticeModal: React.FC<ViewNoticeModalProps> = ({ isOpen, notice, onClose }) => {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Notice Details</h2>
        <div className="space-y-2">
          <div className="break-all"><strong>Title:</strong> {notice.title}</div>
          <div className="break-all"><strong>Content:</strong> {notice.content}</div>
          <div><strong>Type:</strong> {notice.type}</div>
          <div><strong>Category:</strong> {notice.category}</div>
          <div><strong>Priority:</strong> {notice.priority}</div>
          <div><strong>Publish Date:</strong> {new Date(notice.publishDate).toLocaleDateString()}</div>
          <div><strong>Expiry Date:</strong> {new Date(notice.expiryDate).toLocaleDateString()}</div>
          <div><strong>Author:</strong> {typeof notice.author === 'object' && notice.author !== null ? (notice.author.name || notice.author.email || 'Unknown') : (notice.author || 'Unknown')}</div>
          {notice.settings?.pinToTop && <div><strong>Pinned:</strong> Yes</div>}
        </div>
      </div>
    </div>
  );
};

export default ViewNoticeModal; 