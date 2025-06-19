import { PermissionLevel, type PermissionLevelType } from '../../state/User/permissions'

// Interface for navigation link items
export interface NavLink {
  title: string;         // Display name shown in the UI
  path: string;          // Redirect endpoint/URL
  permission: PermissionLevelType; // Required permission to see this link
  children?: NavLink[];   // Optional dropdown children
  icon?: string;         // Optional icon name (for future use)
}

/**
 * Main navigation links with permission requirements
 * These define all possible links that can appear in the navigation
 */
export const navigationLinks: NavLink[] = [
  {
    title: 'Home',
    path: '/',
    permission: PermissionLevel.PUBLIC,
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    permission: PermissionLevel.USER,
  },
  {
    title: 'Products',
    path: '/products',
    permission: PermissionLevel.PUBLIC,
    children: [
      {
        title: 'Product Catalog',
        path: '/products/catalog',
        permission: PermissionLevel.PUBLIC,
      },
      {
        title: 'New Releases',
        path: '/products/new',
        permission: PermissionLevel.PUBLIC,
      },
      {
        title: 'Product Management',
        path: '/products/manage',
        permission: PermissionLevel.ADMIN,
      }
    ]
  },
  {
    title: 'Admin',
    path: '/admin',
    permission: PermissionLevel.ADMIN,
  },
  {
    title: 'Services',
    path: '/services',
    permission: PermissionLevel.PUBLIC,
    children: [
      {
        title: 'Service Offerings',
        path: '/services/offerings',
        permission: PermissionLevel.PUBLIC,
      },
      {
        title: 'Request Service',
        path: '/services/request',
        permission: PermissionLevel.USER,
      },
      {
        title: 'Service Management',
        path: '/services/manage',
        permission: PermissionLevel.ADMIN,
      }
    ]
  },
  {
    title: 'Reports',
    path: '/reports',
    permission: PermissionLevel.USER,
    children: [
      {
        title: 'User Reports',
        path: '/reports/user',
        permission: PermissionLevel.USER,
      },
      {
        title: 'Sales Reports',
        path: '/reports/sales',
        permission: PermissionLevel.ADMIN,
      },
      {
        title: 'System Analytics',
        path: '/reports/analytics',
        permission: PermissionLevel.ADMIN,
      }
    ]
  },
  {
    title: 'Admin',
    path: '/admin',
    permission: PermissionLevel.ADMIN,
    children: [
      {
        title: 'User Management',
        path: '/admin/users',
        permission: PermissionLevel.ADMIN,
      },
      {
        title: 'Settings',
        path: '/admin/settings',
        permission: PermissionLevel.ADMIN,
      },
      {
        title: 'System Configuration',
        path: '/admin/system',
        permission: PermissionLevel.SUPER_ADMIN,
      }
    ]
  },
  {
    title: 'About',
    path: '/about',
    permission: PermissionLevel.PUBLIC,
  },
  {
    title: 'Contact',
    path: '/contact',
    permission: PermissionLevel.PUBLIC,
  },
];

/**
 * Filter navigation links based on user permissions
 * 
 * @param links List of all navigation links
 * @param userRoles User's current roles/permissions
 * @returns Filtered list of links the user has access to
 */
export const filterLinksByPermission = (
  links: NavLink[],
  userRoles: string[] = []
): NavLink[] => {
  // If user has super_admin role, they can see everything
  if (userRoles.includes(PermissionLevel.SUPER_ADMIN)) {
    return links;
  }

  return links
    .filter(link => {
      // Public links are always visible
      if (link.permission === PermissionLevel.PUBLIC) {
        return true;
      }

      // Check if user has the required permission
      return userRoles.includes(link.permission);
    })
    .map(link => {
      // If no children or no authorized children, return link as is
      if (!link.children || link.children.length === 0) {
        return link;
      }

      // Filter children by permission
      const filteredChildren = filterLinksByPermission(link.children, userRoles);

      // Return link with filtered children
      return {
        ...link,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    })
    // Filter out links that had children but all children were filtered out
    .filter(link => !link.children || link.children.length > 0);
};

/**
 * Get navigation links for the current user based on their roles
 * 
 * @param userRoles Array of user's permission roles
 * @returns Navigation links available to the user
 */
export const getAuthorizedLinks = (userRoles: string[] = []): NavLink[] => {
  return filterLinksByPermission(navigationLinks, userRoles);
};
