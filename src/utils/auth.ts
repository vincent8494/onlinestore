// Types
type UserRole = 'admin' | 'seller' | 'customer';

// Mock user data - in a real app, this would come from your auth system
export const getCurrentUser = () => {
  // This is a mock implementation
  // Replace with actual user data from your auth context/state
  const user = {
    id: 'user-123',
    name: 'Seller Name',
    email: 'seller@example.com',
    role: 'seller' as UserRole,
  };
  return user;
};

export const hasRole = (requiredRole: UserRole): boolean => {
  const user = getCurrentUser();
  return user.role === requiredRole;
};

export const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
  const user = getCurrentUser();
  return requiredRoles.includes(user.role);
};

// Check if user can update product status
export const canUpdateProductStatus = (): boolean => {
  return hasAnyRole(['admin', 'seller']);
};
