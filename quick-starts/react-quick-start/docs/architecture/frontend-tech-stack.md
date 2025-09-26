# Frontend Tech Stack

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
