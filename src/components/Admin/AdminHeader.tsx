import { Bell, LogOut } from "lucide-react";
import { UserData } from "../../api/types/users";

interface NavigationItem {
  name: string;
  href?: string;
  icon?: any;
  dropdown?: boolean;
  children?: NavigationItem[];
}

interface AdminHeaderProps {
  user: UserData | null;
  navigation: NavigationItem[];
  isActive: (href: string) => boolean;
  logout: () => void;
}

export const AdminHeader = ({ user, navigation, isActive, logout }: AdminHeaderProps) => {
  // Find the active item, including children
  const findActiveName = (nav: NavigationItem[]): string => {
    for (const item of nav) {
      if (item.href && isActive(item.href)) return item.name;
      if (item.children) {
        const child = item.children.find(child => child.href && isActive(child.href));
        if (child) return child.name;
      }
    }
    return 'Dashboard';
  };
  return (
    <header className="fixed top-0 right-0 left-64 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {findActiveName(navigation)}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
              </span>
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