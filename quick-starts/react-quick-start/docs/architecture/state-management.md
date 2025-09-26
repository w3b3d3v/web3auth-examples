# State Management

## Store Structure

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
