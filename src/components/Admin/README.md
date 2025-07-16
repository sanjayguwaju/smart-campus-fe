# Admin Components Structure

This directory contains all admin-related components organized by functionality for better maintainability and scalability.

## Directory Structure

```
src/components/Admin/
├── index.ts                 # Main export file
├── AdminHeader.tsx          # Admin header component
├── AdminLayout.tsx          # Admin layout wrapper
├── Events/                  # Event management components
│   ├── index.ts
│   ├── ViewEventModal.tsx
│   ├── AddEventModal.tsx
│   ├── EditEventModal.tsx
│   ├── DeleteEventModal.tsx
│   └── EventsFilterDrawer.tsx
├── Users/                   # User management components
│   ├── index.ts
│   ├── ViewUserModal.tsx
│   ├── AddUserModal.tsx
│   ├── EditUserModal.tsx
│   ├── ActivateUserModal.tsx
│   ├── DeactivateUserModal.tsx
│   ├── ResetPasswordModal.tsx
│   └── UsersFilterDrawer.tsx
├── Notices/                 # Notice management components
│   ├── index.ts
│   ├── AddNoticeModal.tsx
│   ├── EditNoticeModal.tsx
│   ├── ViewNoticeModal.tsx
│   └── NoticeFilterDrawer.tsx
├── Programs/                # Program management components
│   ├── index.ts
│   ├── AddProgramModal.tsx
│   ├── EditProgramModal.tsx
│   └── DeleteProgramModal.tsx
├── Blogs/                   # Blog management components
│   ├── index.ts
│   └── ViewBlogModal.tsx
└── Shared/                  # Shared/common components
    ├── index.ts
    ├── DeleteConfirmationModal.tsx
    └── ProtectedRoute.tsx
```

## Usage

### Importing from specific categories:
```typescript
// Import event components
import { ViewEventModal, AddEventModal } from '../components/Admin/Events';

// Import user components
import { ViewUserModal, AddUserModal } from '../components/Admin/Users';

// Import notice components
import { AddNoticeModal, EditNoticeModal } from '../components/Admin/Notices';
```

### Importing from main admin index:
```typescript
// Import all admin components
import { 
  ViewEventModal, 
  AddUserModal, 
  AdminLayout,
  DeleteConfirmationModal 
} from '../components/Admin';
```

## Benefits

1. **Better Organization**: Components are grouped by functionality
2. **Easier Maintenance**: Related components are in the same directory
3. **Scalability**: Easy to add new components to appropriate categories
4. **Clean Imports**: Use specific imports or import everything from main index
5. **Type Safety**: All exports are properly typed
6. **Documentation**: Each category has its own index file for clear exports

## Adding New Components

1. Create the component in the appropriate category folder
2. Add the export to the category's `index.ts` file
3. The component will automatically be available through the main admin index

## Best Practices

- Keep related components together in the same folder
- Use descriptive names for components
- Export all components through index files
- Maintain consistent naming conventions
- Add proper TypeScript types for all components 