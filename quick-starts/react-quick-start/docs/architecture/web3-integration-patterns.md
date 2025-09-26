# Web3 Integration Patterns

## Current Implementation Examples

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
