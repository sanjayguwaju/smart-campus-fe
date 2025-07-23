import React, { useEffect, useState } from 'react';
import { programService, ProgramApplication } from '../../../api/services/programService';

const ProgramApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await programService.rejectProgramApplication(id, reason);
      setApplications(apps => apps.map(app => app._id === id ? { ...app, status: 'rejected', reason } : app));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reject application');
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
              <td className="border px-4 py-2">{app.studentId}</td>
              <td className="border px-4 py-2">{app.program?.name || app.program}</td>
              <td className="border px-4 py-2 capitalize">{app.status}</td>
              <td className="border px-4 py-2">{new Date(app.appliedAt).toLocaleString()}</td>
              <td className="border px-4 py-2">
                {app.status === 'pending' && (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleApprove(app._id)}>Approve</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleReject(app._id)}>Reject</button>
                  </>
                )}
                {app.status !== 'pending' && <span className="text-gray-400">No actions</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramApplicationsList; 