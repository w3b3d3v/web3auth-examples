import { useState } from "react";
import { useWeb3Auth } from "@web3auth/modal/react";
import { useChainId } from "wagmi";

export function ExportPrivateKey() {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { web3Auth } = useWeb3Auth();
  const chainId = useChainId();

  // Get network-specific information for private key export method
  const getPrivateKeyMethod = () => {
    switch (chainId) {
      case 420420422: // Passet Hub (Polkadot-based)
      case 420420418: // Kusama Asset Hub
      case 420420421: // Westend
        return "private_key"; // Non-EVM chains
      case 1: // Ethereum Mainnet
      default:
        return "eth_private_key"; // Ethereum/EVM chains
    }
  };

  const getNetworkInfo = () => {
    switch (chainId) {
      case 420420422:
        return { name: 'Passet Hub', type: 'Polkadot-based' };
      case 420420418:
        return { name: 'Kusama Asset Hub', type: 'Polkadot-based' };
      case 420420421:
        return { name: 'Westend Network', type: 'Polkadot-based' };
      case 1:
        return { name: 'Ethereum Mainnet', type: 'EVM' };
      default:
        return { name: 'Unknown Network', type: 'EVM' };
    }
  };

  const networkInfo = getNetworkInfo();

  const exportPrivateKey = async () => {
    if (!web3Auth?.provider) {
      setError("Web3Auth provider not available");
      return;
    }

    setLoading(true);
    setError("");
    setPrivateKey("");
    setCopied(false);

    try {
      const method = getPrivateKeyMethod();
      console.log(`Requesting private key using method: ${method}`);

      const privateKeyHex = await web3Auth.provider.request({
        method: method
      });

      if (privateKeyHex) {
        setPrivateKey(privateKeyHex as string);
      } else {
        setError("Failed to retrieve private key");
      }
    } catch (err: any) {
      console.error("Private key export error:", err);
      setError(err.message || "Failed to export private key");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (privateKey) {
      try {
        await navigator.clipboard.writeText(privateKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  const clearPrivateKey = () => {
    setPrivateKey("");
    setError("");
    setCopied(false);
  };

  return (
    <div>
      <h2>Export Private Key</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>
        Network: {networkInfo.name} | Type: {networkInfo.type}
      </p>
      <p style={{ fontSize: '12px', color: '#ff6b35', marginBottom: '15px' }}>
        ⚠️ <strong>Warning:</strong> Never share your private key with anyone. Store it securely and only use it when necessary.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={exportPrivateKey}
          disabled={loading || !web3Auth?.provider}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? 'var(--text-muted)' : '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Exporting...' : 'Export Private Key'}
        </button>

        {privateKey && (
          <button
            onClick={clearPrivateKey}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--text-muted)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#3d1a1a',
          borderRadius: 'var(--radius)',
          color: '#ff6b6b',
          fontSize: '14px',
          border: '1px solid #722020'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {privateKey && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: 'var(--bg-light)',
          borderRadius: 'var(--radius)',
          border: '2px solid #ff6b35'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <strong style={{ color: 'var(--text-color)' }}>Private Key:</strong>
            <button
              onClick={copyToClipboard}
              style={{
                padding: '5px 10px',
                backgroundColor: copied ? '#00cc00' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <code style={{
            fontSize: '12px',
            wordBreak: 'break-all',
            display: 'block',
            padding: '8px',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-color)'
          }}>
            {privateKey}
          </code>
        </div>
      )}
    </div>
  );
}