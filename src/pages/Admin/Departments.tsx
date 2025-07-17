import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useDepartments, useDeleteDepartment } from '../../api/hooks/useDepartments';
import { DepartmentData } from '../../api/types/departments';
import { 
  AddDepartmentModal, 
  EditDepartmentModal, 
  DeleteDepartmentModal, 
  ViewDepartmentModal, 
  DepartmentsFilterDrawer 
} from '../../components/Admin/Departments';

const Departments: React.FC = () => {
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null);
  const [filters, setFilters] = useState({ name: '', code: '', headOfDepartment: '', status: '' });

  // Pagination and search can be added as needed
  const { data, isLoading } = useDepartments(1, 20, '', filters);
  const departments = data?.departments || [];
  const deleteDepartmentMutation = useDeleteDepartment();

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    await deleteDepartmentMutation.mutateAsync(selectedDepartment._id);
    setDeleteOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" /> Filter
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Department
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8">No departments found.</td></tr>
            ) : (
              departments.map((dept: DepartmentData) => (
                <tr key={dept._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.headOfDepartment || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => { setSelectedDepartment(dept); setViewOpen(true); }}
                      className="text-blue-600 hover:underline text-xs"
                    >View</button>
                    <button
                      onClick={() => { setSelectedDepartment(dept); setEditOpen(true); }}
                      className="text-yellow-600 hover:underline text-xs"
                    >Edit</button>
                    <button
                      onClick={() => { setSelectedDepartment(dept); setDeleteOpen(true); }}
                      className="text-red-600 hover:underline text-xs"
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modals and Drawers */}
      <AddDepartmentModal isOpen={isAddOpen} onClose={() => setAddOpen(false)} />
      <EditDepartmentModal isOpen={isEditOpen} onClose={() => setEditOpen(false)} department={selectedDepartment} />
      <DeleteDepartmentModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onDelete={handleDelete} departmentName={selectedDepartment?.name || ''} isDeleting={deleteDepartmentMutation.isPending} />
      <ViewDepartmentModal isOpen={isViewOpen} onClose={() => setViewOpen(false)} department={selectedDepartment} />
      <DepartmentsFilterDrawer isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default Departments; 