import React, { useEffect, useState } from 'react';
import { programService, ProgramApplication } from '../../../api/services/programService';
import RejectApplicationModal from './RejectApplicationModal';

const ProgramApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectingStudentId, setRejectingStudentId] = useState<string | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    programService.getProgramApplications()
      .then(res => setApplications(res.data))
      .catch(err => setError(err?.response?.data?.message || 'Failed to fetch applications'))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await programService.approveProgramApplication(id);
      setApplications(apps => apps.map(app => app._id === id ? { ...app, status: 'approved' } : app));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to approve application');
    }
  };

  const openRejectModal = (id: string, studentId: string) => {
    setRejectingId(id);
    setRejectingStudentId(studentId);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingId || !rejectingStudentId) return;
    setRejectLoading(true);
    try {
      await programService.rejectProgramApplication(rejectingId, reason, rejectingStudentId);
      setApplications(apps => apps.map(app => app._id === rejectingId ? { ...app, status: 'rejected', reason } : app));
      setRejectModalOpen(false);
      setRejectingId(null);
      setRejectingStudentId(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reject application');
    } finally {
      setRejectLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Program Applications</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student ID</th>
            <th className="border px-4 py-2">Program</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Applied At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td className="border px-4 py-2">
                {app.studentId ||
                  app.student?.studentId ||
                  app.student?.fullName ||
                  (app.student?.firstName && app.student?.lastName
                    ? `${app.student.firstName} ${app.student.lastName}`
                    : typeof app.student === 'string'
                      ? app.student
                      : 'N/A')}
              </td>
              <td className="border px-4 py-2">{app.program?.name || app.program}</td>
              <td className="border px-4 py-2 capitalize">{app.status}</td>
              <td className="border px-4 py-2">{new Date(app.appliedAt).toLocaleString()}</td>
              <td className="border px-4 py-2">
                {app.status === 'pending' && (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleApprove(app._id)}>Approve</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => openRejectModal(app._id, app.studentId || app.student?.studentId || app.student)}>Reject</button>
                  </>
                )}
                {app.status !== 'pending' && <span className="text-gray-400">No actions</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <RejectApplicationModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        loading={rejectLoading}
      />
    </div>
  );
};

export default ProgramApplicationsList; 