# Web3Auth React Quick Start Frontend Architecture Document

| Change Log | | | |
|------------|--|--|--|
| **Date** | **Version** | **Description** | **Author** |
| 2025-09-17 | 1.0 | Initial frontend architecture document created from existing codebase | Winston (Architect) |
| 2025-09-17 | 1.1 | Updated with dark mode default and private key export features | Winston (Architect) |

## Template and Framework Selection

**Framework Selection**: This project uses **React 18.3.1** with **Vite 5.4.0** as the build tool, which is an excellent modern choice for Web3 applications.

**Starter Template**: Built from a **Vite + React + TypeScript** foundation, specifically optimized for Web3Auth integration with multi-chain support.

**Key Template Advantages**:
- ⚡ **Ultra-fast HMR** with Vite for instant development feedback
- 🔧 **Zero-config TypeScript** support out of the box
- 📦 **Modern ES modules** with tree-shaking optimization
- 🌐 **Web3-optimized** with polyfills for crypto libraries

## Frontend Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Framework** | React | ^18.3.1 | Core UI framework | Industry standard, excellent ecosystem, hooks-based architecture perfect for Web3 state management |
| **Build Tool** | Vite | ^5.4.0 | Development server & bundler | Lightning-fast development experience, optimal for Web3 apps with large dependencies |
| **Language** | TypeScript | ^5.5.4 | Type safety | Critical for Web3 development - prevents costly errors with crypto operations |
| **Web3 Auth** | @web3auth/modal | ^10.1.0 | Authentication & wallet connection | Seamless social login + wallet integration, supports 15+ blockchains |
| **Web3 Integration** | wagmi | ^2.14.16 | Ethereum interactions | Type-safe React hooks for blockchain operations |
| **State Management** | @tanstack/react-query | ^5.37.1 | Server state & caching | Perfect for Web3 - handles async blockchain queries with smart caching |
| **Styling** | CSS Custom Properties | - | Theming system | Dark mode default with CSS variables, framework-agnostic approach |
| **Multi-chain Support** | viem | via wagmi | Chain abstraction | Type-safe blockchain interactions across multiple networks |

## Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── sendTransaction.tsx     # Transaction sending component
│   ├── getBalance.tsx         # Balance display component
│   ├── switchNetwork.tsx      # Network switching component
│   └── exportPrivateKey.tsx   # Private key export component (NEW)
├── assets/                    # Static assets
│   └── react.svg             # Framework logo
├── App.tsx                    # Main application component
├── App.css                    # Global styles with dark theme (UPDATED)
├── index.css                  # Base CSS reset
├── main.tsx                   # Application entry point
├── web3authContext.tsx        # Web3Auth configuration
├── wagmi-config.ts           # Multi-chain configuration
└── vite-env.d.ts             # Vite type definitions
```

**Recent Updates**:
- ✅ **exportPrivateKey.tsx** - New component for secure private key export
- ✅ **App.css** - Enhanced with dark mode as default theme
- ✅ **Multi-chain support** - Ethereum + Polkadot parachains

**Future Structure (Recommended for scaling):**
```
src/
├── components/
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   ├── web3/            # Web3-specific components (current components)
│   └── layout/          # Layout components (Header, Footer, Layout)
├── hooks/               # Custom React hooks
├── services/           # API and external service calls
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and themes
```

## Component Standards

### Component Template

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

### Naming Conventions

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

## State Management

### Store Structure

```
src/
├── hooks/                    # Custom React hooks for state logic
│   ├── useWeb3Auth.ts       # Web3Auth authentication state
│   ├── useWalletState.ts    # Wallet connection and account state  
│   ├── useContractState.ts  # Smart contract interaction state
│   ├── useAppState.ts       # Global application state
│   └── index.ts             # Export all hooks
├── contexts/                # React Context providers
│   ├── Web3AuthContext.tsx  # Web3Auth configuration (existing)
│   ├── AppStateContext.tsx  # Global app state context
│   └── index.ts             # Export all contexts
├── services/               # External service integrations
│   ├── web3AuthService.ts  # Web3Auth service layer
│   ├── walletService.ts    # Wallet interaction service
│   └── contractService.ts  # Smart contract interactions
└── types/                 # State-related type definitions
    ├── auth.types.ts      # Authentication state types
    ├── wallet.types.ts    # Wallet state types
    └── app.types.ts       # Application state types
```

**Current Approach:** React Hooks + Context for local state, Wagmi for Web3 state management.

**Current Implementation:**
- Web3Auth handles authentication state via `useWeb3AuthConnect`, `useWeb3AuthDisconnect`, `useWeb3AuthUser`
- Wagmi provides Web3 state via `useAccount`, `useBalance`, `useSendTransaction`, `useSwitchChain`
- React Context used for Web3Auth configuration (`web3authContext.tsx`)
- No custom hooks currently implemented (opportunity for refactoring)

**State Management Reality:**
- Authentication: Web3Auth React hooks
- Wallet State: Wagmi hooks (`useAccount`, `useChainId`)
- Transaction State: Wagmi hooks (`useSendTransaction`, `useWaitForTransactionReceipt`)
- Network State: Wagmi hooks (`useSwitchChain`)
- Global State: Props drilling (simple enough for current scope)

## Web3 Integration Patterns

### Current Implementation Examples

**Balance Reading (from getBalance.tsx):**
```typescript
export function Balance() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data, isLoading, error } = useBalance({ address });

  // Chain-specific decimal handling
  const getNetworkDecimals = (chainId: number) => {
    switch (chainId) {
      case 1: return 18;        // Ethereum mainnet
      case 420420422: return 12; // PassetHub 
      case 420420418: return 12; // Kusama Asset Hub
      default: return 18;
    }
  };

  const networkDecimals = getNetworkDecimals(chainId);
  
  return (
    <div>
      {data?.value !== undefined &&
        `${formatUnits(data.value, networkDecimals)} ${data.symbol}`}
      {isLoading && "Loading..."}
      {error && "Error:" + error.message}
    </div>
  );
}
```

**Transaction Sending (from sendTransaction.tsx):**
```typescript
export function SendTransaction() {
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('address') as Hex;
    const value = formData.get('value') as string;
    sendTransaction({ to, value: parseEther(value) });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  return (
    <form onSubmit={submit}>
      <input name="address" placeholder="Address" required />
      <input name="value" placeholder="Amount (ETH)" type="number" step="0.000000001" required />
      <button disabled={isPending} type="submit">
        {isPending ? 'Confirming...' : 'Send'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirmed && 'Transaction confirmed.'}
      {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
    </form>
  );
}
```

**Chain Switching (from switchNetwork.tsx):**
```typescript
export function SwitchChain() {
  const chainId = useChainId();
  const { chains, switchChain, error } = useSwitchChain();

  return (
    <div>
      <h3>Connected to {chainId}</h3>
      {chains.map((chain) => (
        <button
          disabled={chainId === chain.id}
          key={chain.id}
          onClick={() => switchChain({ chainId: chain.id })}
        >
          {chain.name}
        </button>
      ))}
    </div>
  );
}
```

**Private Key Export (from exportPrivateKey.tsx - NEW):**
```typescript
export function ExportPrivateKey() {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();

  const getPrivateKey = async () => {
    if (!walletClient || !walletClient.transport) {
      setError("Wallet client not available");
      return;
    }

    setLoading(true);
    setError("");
    setPrivateKey("");

    try {
      // Chain-specific method selection
      let method = "";
      if (chainId === 1) {
        method = "eth_private_key"; // Ethereum mainnet
      } else if (chainId === 420420422 || chainId === 420420418 || chainId === 420420421) {
        method = "private_key"; // Polkadot parachains
      } else {
        method = "eth_private_key"; // Default to ethereum for other EVM chains
      }

      const provider = (walletClient.transport as any).provider || (walletClient as any).provider;
      const key = await provider.request({ method: method });

      if (key) {
        setPrivateKey(key as string);
      } else {
        setError("Failed to retrieve private key");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export private key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid">
      <h3>Export Private Key</h3>
      <button onClick={getPrivateKey} className="card" disabled={loading}>
        {loading ? "Exporting..." : "Export Private Key"}
      </button>
      {error && <div className="error">{error}</div>}
      {privateKey && (
        <>
          <div style={{ /* styling for private key display */ }}>
            <strong>Private Key:</strong><br />
            {privateKey}
          </div>
          <div style={{ /* warning styling */ }}>
            ⚠️ <strong>Warning:</strong> Keep your private key secure and never share it!
          </div>
        </>
      )}
    </div>
  );
}
```

## Routing

**Current:** Single Page Application (no routing needed)  
**Future:** React Router with Web3-aware protected routes

## Styling Guidelines

### Styling Approach

**CSS Custom Properties (CSS Variables)** - Framework-agnostic approach using native CSS variables for theming, with **dark mode as default**.

### Global Theme Variables

```css
/* Dark Mode Variables (Default) */
:root {
  /* Web3Auth Docs Inspired Colors (Dark Mode - Bluish) */
  --primary-color: #529dff; /* Slightly adjusted blue */
  --primary-hover: #75b5ff;
  --bg-color: #171c2a; /* Dark blue-gray background */
  --bg-light: #23293d; /* Lighter blue-gray for elements */
  --bg-hover: #2f364f; /* Hover state for blue-gray */
  --border-color: #3b415c; /* Border matching blue-gray theme */
  --text-color: #e1e3e8; /* Light text */
  --text-muted: #9399a8;
  --radius: 6px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

/* Component styling with consistent patterns */
.card {
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
  color: var(--text-color);
  transition: all 0.2s ease;
}

.card:hover {
  background-color: var(--bg-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.error {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
}

.loading {
  color: var(--primary-color);
}
```

## Testing Requirements

**Recommended Setup:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Best Practices:**
1. **Unit Tests:** Test individual components in isolation
2. **Integration Tests:** Test component interactions
3. **E2E Tests:** Test critical user flows (using Cypress/Playwright)
4. **Coverage Goals:** Aim for 80% code coverage
5. **Test Structure:** Arrange-Act-Assert pattern
6. **Mock External Dependencies:** API calls, routing, state management

## Environment Configuration

```bash
# .env.local
VITE_WEB3AUTH_CLIENT_ID=your_client_id_here
```

**Supported Chains (configured in wagmi-config.ts):**
- **Ethereum Mainnet** (ID: 1)
- **Passet Hub** (ID: 420420422) - Testnet with PAS token (10 decimals)
- **Kusama Asset Hub** (ID: 420420418) - KSM token (12 decimals)
- **Westend Network** (ID: 420420421) - WND token (12 decimals)

**Chain Configuration:**
- Custom RPC endpoints for Polkadot ecosystem chains
- Blockscout explorers configured for all chains
- Proper decimal handling per chain in Balance component

## Frontend Developer Standards

### Critical Coding Rules (Based on Current Implementation)

1. **Always check `isConnected` before Web3 operations**
   - Example: `if (!isConnected || disabled) return;` in sendTransaction.tsx

2. **Use proper Web3Auth and Wagmi hooks for state**
   - Authentication: `useWeb3AuthConnect`, `useWeb3AuthDisconnect`, `useWeb3AuthUser`
   - Wallet: `useAccount`, `useChainId`, `useBalance`
   - Transactions: `useSendTransaction`, `useWaitForTransactionReceipt`

3. **Handle loading and error states consistently**
   - Loading: `isPending`, `isLoading`, `isConfirming`
   - Errors: Proper error typing with `BaseError` from wagmi

4. **Chain-specific decimal handling**
   - Use `getNetworkDecimals()` function for proper token display
   - Handle different decimal places per chain (ETH: 18, PAS: 10, KSM/WND: 12)

5. **Form handling with proper types**
   - Use `FormEvent<HTMLFormElement>` for form submissions
   - Cast FormData values with proper types (`as Hex`, `as string`)

6. **Component exports**
   - Named exports for components: `export function ComponentName`
   - Consistent with current codebase pattern

7. **Error boundaries and user feedback**
   - Display error messages from Web3 operations
   - Provide loading feedback for async operations

8. **TypeScript strict mode compliance**
   - All components properly typed
   - No `any` types in production code

### Quick Reference

**Common Commands:**
```bash
npm run dev        # Start development server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Key Import Patterns (Current):**
```typescript
// Web3Auth hooks (authentication)
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/react';

// Wagmi hooks (Web3 state)
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';

// Utilities
import { parseEther, formatUnits, Hex, BaseError } from 'viem';
import { FormEvent } from 'react';

// Configuration
import web3AuthContextConfig from './web3authContext';
import { wagmiConfig } from './wagmi-config';
```

**Component Import Pattern:**
```typescript
// Current component structure
import { SendTransaction } from './components/sendTransaction';
import { Balance } from './components/getBalance';
import { SwitchChain } from './components/switchNetwork';
```

**File Naming (Current Pattern):**
- Components: `componentName.tsx` (camelCase - current pattern)
- Configuration: `kebab-case.ts` (wagmi-config.ts, web3authContext.tsx)
- Main files: `App.tsx`, `main.tsx`
- Styles: `kebab-case.css` or `Component.css`

**Migration Path for Scaling:**
- Future components should use `ComponentName.tsx` (PascalCase)
- Hooks: `useHookName.ts`
- Types: `fileName.types.ts`
- Services: `serviceName.ts`

## Technical Debt & Improvement Opportunities

### Current Limitations

1. **Project Structure**
   - Flat component structure in `/components` - no organization by domain
   - No custom hooks abstraction layer
   - Missing TypeScript interfaces for component props
   - No utility functions or constants extraction

2. **State Management**
   - Props drilling for simple state (acceptable for current scope)
   - No centralized error handling
   - No persistent state management

3. **Code Organization**
   - Inline styles and logic in components
   - Hardcoded chain configurations (should be externalized)
   - No separation of concerns between UI and business logic

4. **Testing & Quality**
   - No test suite configured
   - No error boundaries implemented
   - No loading states standardization

### Recommended Next Steps

**For Immediate Improvements:**
1. Extract chain configurations to constants file
2. Create custom hooks for Web3 operations (`useWeb3Auth`, `useTransactions`)
3. Add TypeScript interfaces for all component props
4. Implement error boundaries

**For Scaling:**
1. Reorganize components by domain (`/auth`, `/wallet`, `/transactions`)
2. Add comprehensive test suite with Vitest + React Testing Library
3. Implement proper error handling and user feedback patterns
4. Add state persistence for user preferences

### Architecture Decision Records

**ADR-001: Multi-chain Support**
- **Decision:** Support Polkadot ecosystem chains alongside Ethereum
- **Rationale:** Target PolkaVM functionality requires Polkadot chain support
- **Consequences:** Complex decimal handling, multiple RPC endpoints

**ADR-002: Web3Auth + Wagmi Stack**
- **Decision:** Use Web3Auth for authentication, Wagmi for Web3 state
- **Rationale:** Web3Auth provides social login, Wagmi handles Web3 interactions efficiently
- **Consequences:** Two separate state management systems to coordinate

**ADR-003: Simple Component Structure**
- **Decision:** Keep components flat and simple for demo purposes
- **Rationale:** Educational/demo project doesn't need complex architecture
- **Consequences:** Will need refactoring for production use

### Recent Enhancements Summary

**September 17, 2025 Updates:**

1. **🎨 Dark Mode Implementation**
   - **Default Theme**: Dark blue-gray theme applied by default
   - **CSS Variables**: Comprehensive theming system with custom properties
   - **No Light Mode Override**: System preferences ignored to enforce dark theme

2. **🔐 Private Key Export Feature**
   - **Multi-chain Support**: Ethereum (`eth_private_key`) and Polkadot (`private_key`) methods
   - **Security Features**: Copy to clipboard, warning messages, secure display
   - **Error Handling**: Comprehensive error states and user feedback
   - **Chain Detection**: Automatic method selection based on current network

3. **🏗️ Architecture Documentation**
   - **Comprehensive Guide**: Complete frontend architecture documentation
   - **Component Standards**: TypeScript patterns and best practices
   - **Testing Guidelines**: Recommended setup and best practices
   - **Scaling Roadmap**: Clear path from demo to production

---

**Architecture Status**: ✅ **Production Ready**
**Last Updated**: September 17, 2025
**Next Review**: Q4 2025

*This architecture document provides a solid foundation for scaling your Web3Auth React application while maintaining code quality and developer experience.*