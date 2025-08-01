import { LogOut, User } from "lucide-react";
import { UserData } from "../../api/types/users";

interface AdminHeaderProps {
  user: UserData | null;
  navigation: Array<{ href: string; name: string }>;
  isActive: (href: string) => boolean;
  logout: () => void;
}

export const AdminHeader = ({ user, navigation, isActive, logout }: AdminHeaderProps) => {
  return (
    <header className="fixed top-0 right-0 left-64 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 