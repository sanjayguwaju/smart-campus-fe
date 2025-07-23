import React, { useEffect, useState } from 'react';
import { programService, ProgramApplication } from '../../../api/services/programService';
import RejectApplicationModal from './RejectApplicationModal';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { userService } from '../../../api/services/userService';

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getStatusChip(status: string) {
  if (status === 'pending') return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>;
  if (status === 'approved') return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Approved</span>;
  if (status === 'rejected') return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">Rejected</span>;
  return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
}

const ViewStudentModal: React.FC<{ open: boolean; onClose: () => void; application: any }> = ({ open, onClose, application }) => {
  const [showIdCard, setShowIdCard] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open && application && application.student) {
      setLoading(true);
      userService.getUser(typeof application.student === 'object' ? application.student._id : application.student)
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, [open, application]);
  if (!open || !application) return null;
  const idCardUrl = application.idCardUrl || application.id_card_url || application.id_card || '';
  const student = user || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-8 border-b border-gray-100">
          <span className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-700 font-bold text-3xl">
            {getInitials(student.fullName || student.displayName || application.studentId || '')}
          </span>
          <div className="flex-1">
            <div className="font-bold text-2xl text-gray-900 mb-1">{student.fullName || student.displayName || application.studentId || 'N/A'}</div>
            <div className="text-gray-500 text-base mb-2">{student.email || '-'}</div>
            <div className="flex gap-2 mb-2">
              {student.role && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.role === 'admin' ? 'bg-red-100 text-red-700' : student.role === 'faculty' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{student.role.charAt(0).toUpperCase() + student.role.slice(1)}</span>
              )}
              {student.isActive !== undefined && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{student.isActive ? 'Active' : 'Inactive'}</span>
              )}
            </div>
            <div className="text-gray-500 text-sm">View detailed information for this user</div>
          </div>
          {/* ID Card Section */}
          <div className="flex flex-col items-center gap-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">College ID Card</label>
            {idCardUrl ? (
              <>
                <img
                  src={idCardUrl}
                  alt="ID Card"
                  className="max-w-[120px] max-h-24 object-contain rounded border cursor-pointer hover:shadow-lg"
                  onClick={() => setShowIdCard(true)}
                  title="Click to view full ID card"
                />
                {showIdCard && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowIdCard(false)}>
                    <img src={idCardUrl} alt="Full ID Card" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border-4 border-white" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400 text-xs">No ID card uploaded.</div>
            )}
          </div>
        </div>
        {/* Details Sections */}
        <div className="p-8 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-2">
            <div className="font-semibold text-gray-900 mb-4">Personal Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>First Name</div>
                <div className="text-gray-900 font-medium">{student.firstName || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" /></svg>Last Name</div>
                <div className="text-gray-900 font-medium">{student.lastName || '-'}</div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8" /></svg>Phone</div>
                <div className="text-gray-900 font-medium">{student.phone || '-'}</div>
              </div>
            </div>
          </div>
          {/* Academic/Professional Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-2">
            <div className="font-semibold text-gray-900 mb-4">Academic/Professional Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>Department</div>
                <div className="text-gray-900 font-medium">{student.department || '-'}</div>
              </div>
            </div>
          </div>
          {/* Account Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="font-semibold text-gray-900 mb-4">Account Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>Email</div>
                <div className="text-gray-900 font-medium">{student.email || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>Joined</div>
                <div className="text-gray-900 font-medium">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>Last Login</div>
                <div className="text-gray-900 font-medium">{student.lastLogin ? new Date(student.lastLogin).toLocaleString() : '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>Last Updated</div>
                <div className="text-gray-900 font-medium">{student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgramApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectingStudentId, setRejectingStudentId] = useState<string | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [viewStudentModalOpen, setViewStudentModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<any>(null);

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

  const handleViewStudent = (application: any) => {
    setViewStudent(application);
    setViewStudentModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Program Applications</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Program</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied At</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No applications found.</td>
              </tr>
            )}
            {applications.map(app => {
              // Get applicant info
              const student = app.student || {};
              const name = app.studentId || student.fullName || (student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : typeof student === 'string' ? student : 'N/A');
              const email = student.email || '-';
              const initials = getInitials(name);
              // TypeScript: app may have idCardUrl from backend, but not in type
              const idCardUrl = (app as any).idCardUrl || (app as any).id_card_url || (app as any).id_card;
              return (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    {idCardUrl ? (
                      <img
                        src={idCardUrl}
                        alt="ID Card"
                        className="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-sm bg-white"
                      />
                    ) : (
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                        {initials}
                      </span>
                    )}
                    <span className="font-medium text-gray-900">{name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.program?.name || app.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(app.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}<br /><span className="text-xs">{new Date(app.appliedAt).toLocaleTimeString()}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3 items-center">
                      <button
                        className="hover:bg-blue-50 p-2 rounded-full"
                        title="View Student Details"
                        onClick={() => handleViewStudent(app)}
                      >
                        <Eye className="h-5 w-5 text-blue-600" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            className="hover:bg-green-50 p-2 rounded-full"
                            title="Approve Application"
                            onClick={() => handleApprove(app._id)}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </button>
                          <button
                            className="hover:bg-red-50 p-2 rounded-full"
                            title="Reject Application"
                            onClick={() => openRejectModal(app._id, app.studentId || student.studentId || student)}
                          >
                            <XCircle className="h-5 w-5 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <RejectApplicationModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        loading={rejectLoading}
      />
      <ViewStudentModal
        open={viewStudentModalOpen}
        onClose={() => setViewStudentModalOpen(false)}
        application={viewStudent}
      />
    </div>
  );
};

export default ProgramApplicationsList; 