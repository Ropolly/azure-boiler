// Permission levels for application access control
// Using const object instead of enum for compatibility with verbatimModuleSyntax
export const PermissionLevel = {
  PUBLIC: 'public' as const,       // Available to all users including unauthenticated
  USER: 'user' as const,          // Basic authenticated user
  ADMIN: 'admin' as const,        // Admin users only
  SUPER_ADMIN: 'super_admin' as const // Super admin users only
} as const;

// Type for permission levels
export type PermissionLevelType = typeof PermissionLevel[keyof typeof PermissionLevel];

/**
 * Helper function to check if a user has the required permission level
 * 
 * @param userRoles User's current roles
 * @param requiredPermission Permission level required for access
 * @returns Boolean indicating if user has the required permission
 */
export const hasPermission = (
  userRoles: string[] = [], 
  requiredPermission: PermissionLevelType
): boolean => {
  // Public resources are accessible to everyone
  if (requiredPermission === PermissionLevel.PUBLIC) {
    return true;
  }
  
  // Super admins can access everything
  if (userRoles.includes(PermissionLevel.SUPER_ADMIN)) {
    return true;
  }
  
  // Admins can access admin and user level resources
  if (requiredPermission === PermissionLevel.ADMIN) {
    return userRoles.includes(PermissionLevel.ADMIN);
  }
  
  // User level resources require at least user permission
  if (requiredPermission === PermissionLevel.USER) {
    return userRoles.includes(PermissionLevel.USER) || 
           userRoles.includes(PermissionLevel.ADMIN);
  }
  
  return false;
};
