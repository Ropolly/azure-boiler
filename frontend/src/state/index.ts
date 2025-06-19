// State management root file
// Export all your state hooks and contexts from here for easy imports

import { useUser } from './User';
import type { User } from './User';

// Re-export for easier imports
export { useUser };
export type { User };

// Re-export AppState - using direct export since we have the implementation file
export { useAppState } from './useAppState.ts';
