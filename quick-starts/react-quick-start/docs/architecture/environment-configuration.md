# Environment Configuration

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
