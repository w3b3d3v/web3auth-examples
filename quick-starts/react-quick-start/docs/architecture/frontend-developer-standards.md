# Frontend Developer Standards

## Critical Coding Rules (Based on Current Implementation)

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

## Quick Reference

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
