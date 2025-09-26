# Component Standards

## Component Template

```typescript
import React from 'react';
import { useAccount } from 'wagmi';
import './ComponentName.css'; // Optional: component-specific styles

// Props interface - always define explicitly
interface ComponentNameProps {
  title?: string;
  onAction?: (data: any) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Main component using function declaration (consistent with your current style)
export function ComponentName({ 
  title = 'Default Title',
  onAction,
  disabled = false,
  className = '',
  children 
}: ComponentNameProps) {
  // Web3 hooks at the top
  const { address, isConnected } = useAccount();
  
  // Local state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Event handlers
  const handleAction = async () => {
    if (!isConnected || disabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Your logic here
      const result = await someAsyncOperation();
      onAction?.(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  // Early returns for loading/error states
  if (!isConnected) {
    return <div className="error">Please connect your wallet</div>;
  }
  
  return (
    <div className={`component-name ${className}`}>
      <h2>{title}</h2>
      
      {error && <div className="error">Error: {error}</div>}
      
      <button 
        onClick={handleAction}
        disabled={disabled || loading}
        className="card"
      >
        {loading ? 'Loading...' : 'Action Button'}
      </button>
      
      {children}
    </div>
  );
}

// Default export for consistency
export default ComponentName;
```

## Naming Conventions

**Files & Components:**
- **Component Files:** PascalCase with `.tsx` extension (`UserProfile.tsx`)
- **Component Names:** PascalCase, exported as named function (`export function UserProfile`)
- **Hook Files:** camelCase starting with `use` (`useWeb3Auth.ts`)
- **Service Files:** camelCase (`contractService.ts`, `apiClient.ts`)
- **Type Files:** camelCase with `.types.ts` suffix (`user.types.ts`)

**Props & Variables:**
- **Props Interfaces:** `ComponentNameProps` format
- **Event Handlers:** `handle` prefix (`handleSubmit`, `handleConnect`)
- **Boolean Props:** Descriptive names (`isLoading`, `disabled`, `hasError`)
- **Callback Props:** `on` prefix (`onConnect`, `onError`, `onSuccess`)

**CSS Classes:**
- **Component Root:** kebab-case matching component name (`user-profile`)
- **BEM Methodology:** `block__element--modifier` for complex components
- **State Classes:** Descriptive prefixes (`is-loading`, `has-error`)
