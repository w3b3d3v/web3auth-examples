import { useState } from "react";
import { useWalletClient, useChainId } from "wagmi";

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
      let method = "";

      // Determine the method based on chain type
      if (chainId === 1) {
        // Ethereum mainnet
        method = "eth_private_key";
      } else if (chainId === 420420422 || chainId === 420420418 || chainId === 420420421) {
        // Polkadot parachains (Passet Hub, Kusama Asset Hub, Westend)
        method = "private_key";
      } else {
        // Default to ethereum for other EVM chains
        method = "eth_private_key";
      }

      // Access the underlying provider from walletClient
      const provider = (walletClient.transport as any).provider || (walletClient as any).provider;

      if (!provider || !provider.request) {
        setError("Provider request method not available");
        return;
      }

      const key = await provider.request({
        method: method
      });

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      alert("Private key copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="grid">
      <h3>Export Private Key</h3>
      <div className="flex-container">
        <div>
          <button onClick={getPrivateKey} className="card" disabled={loading}>
            {loading ? "Exporting..." : "Export Private Key"}
          </button>
        </div>
        {privateKey && (
          <div>
            <button onClick={copyToClipboard} className="card">
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      {privateKey && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          wordBreak: "break-all",
          fontSize: "12px",
          fontFamily: "monospace"
        }}>
          <strong>Private Key:</strong><br />
          {privateKey}
        </div>
      )}
      {privateKey && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
          fontSize: "14px"
        }}>
          ⚠️ <strong>Warning:</strong> Keep your private key secure and never share it with anyone!
        </div>
      )}
    </div>
  );
}