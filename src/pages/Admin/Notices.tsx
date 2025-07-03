import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter, Pin } from "lucide-react";
import { useNotices, useDeleteNotice } from "../../api/hooks/useNotices";
import { Notice } from "../../api/types/notices";
import AddNoticeModal from "../../components/Admin/AddNoticeModal";
import ViewNoticeModal from "../../components/Admin/ViewNoticeModal";
import EditNoticeModal from "../../components/Admin/EditNoticeModal";
import { usePublishEvent, useUnpublishEvent } from "../../api";
import toast from "react-hot-toast";

const Notices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch notices from backend
  const { data, isLoading, error, refetch } = useNotices();
  const deleteNotice = useDeleteNotice();

  const notices: Notice[] = (data?.data?.notices || []).map((n) => ({
    ...n,
    id: n.id || n._id,
  }));

  const publishEventMutation = usePublishEvent();
  const unpublishEventMutation = useUnpublishEvent();

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || notice.category === categoryFilter;
    const matchesPriority =
      priorityFilter === "all" || notice.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handlePublish = async (notice: Notice) => {
    try {
      await unpublishEventMutation.mutateAsync(notice._id);
      toast.success("Notice published successfully");
    } catch (error) {
      console.log("Failed to publish notice:", error);
      toast.error("Failed to publish notice. Please try again.");
    }
  };

  const handleUnpublish = async (notice: Notice) => {
    try {
      await unpublishEventMutation.mutateAsync(notice._id);
      toast.success("Notice unpublished successfully");
    } catch (error) {
      console.log("Failed to unpublish notice:", error);
      toast.error("Failed to unpublish notice. Please try again.");
    }
  };

  // Sort notices so pinned are at the top
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    const aPinned = a.settings?.pinToTop ? 1 : 0;
    const bPinned = b.settings?.pinToTop ? 1 : 0;
    return bPinned - aPinned;
  });

  const handleSelectNotice = (noticeId: string) => {
    setSelectedNotices((prev) =>
      prev.includes(noticeId)
        ? prev.filter((id) => id !== noticeId)
        : [...prev, noticeId]
    );
  };

  const handleDelete = (noticeId: string) => {
    deleteNotice.mutate(noticeId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exam":
        return "bg-blue-100 text-blue-800";
      case "alert":
        return "bg-red-100 text-red-800";
      case "academic":
        return "bg-green-100 text-green-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Notice Modal */}
      <AddNoticeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      {/* Modals for view and edit */}
      <ViewNoticeModal
        isOpen={isViewModalOpen}
        notice={selectedNotice}
        onClose={() => setIsViewModalOpen(false)}
      />
      <EditNoticeModal
        isOpen={isEditModalOpen}
        notice={selectedNotice}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refetch}
      />

      {/* Page header - matches screenshot */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-600">
            Manage campus notices and announcements
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Post Notice
        </button>
      </div>

      {/* Filters and search - matches screenshot */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="exam">Exam</option>
              <option value="alert">Alert</option>
              <option value="academic">Academic</option>
              <option value="general">General</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notices list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredNotices.length} notices found
            </h3>
            {selectedNotices.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedNotices.length} selected
                </span>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">
              Failed to load notices. Please try again later.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedNotices.map((notice) => (
              <div key={notice.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotices.includes(notice.id)}
                    onChange={() => handleSelectNotice(notice.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {notice.settings?.pinToTop && (
                            <Pin className="h-4 w-4 text-yellow-500" />
                          )}
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                              notice.category
                            )}`}
                          >
                            {notice.category}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              notice.priority
                            )}`}
                          >
                            {notice.priority}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1 break-all">
                          {notice.title}
                        </h2>
                        <p className="text-gray-700 mb-2 line-clamp-2 break-all">
                          {notice.content}
                        </p>
                        <div className="text-sm text-gray-500">
                          By{" "}
                          {typeof notice.author === "object" &&
                          notice.author !== null
                            ? notice.author.name ||
                              notice.author.email ||
                              "Unknown"
                            : notice.author || "Unknown"}{" "}
                          &nbsp; Published:{" "}
                          {new Date(notice.publishDate).toLocaleDateString()}{" "}
                          &nbsp; Expires:{" "}
                          {new Date(notice.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {!notice.isPublished ? (
                          <button
                            onClick={() => handlePublish(notice)}
                            disabled={publishEventMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors text-xs font-medium text-white"
                          >
                            Publish
                          </button>
                        ) : notice.isPublished ? (
                          <button
                            onClick={() => handleUnpublish(notice)}
                            disabled={unpublishEventMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors text-xs font-medium text-white"
                          >
                            Unpublish
                          </button>
                        ) : null}

                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                          onClick={() => {
                            setSelectedNotice(notice);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                          onClick={() => {
                            setSelectedNotice(notice);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          onClick={() => handleDelete(notice.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
