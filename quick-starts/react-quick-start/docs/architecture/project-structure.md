# Project Structure

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
