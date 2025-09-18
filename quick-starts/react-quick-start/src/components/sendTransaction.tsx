import { FormEvent } from "react";
import { useWaitForTransactionReceipt, useSendTransaction, BaseError, useChainId } from "wagmi";
import { Hex, parseUnits } from "viem";

export function SendTransaction() {
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction()
  const chainId = useChainId()

  // Get network-specific information
  const getNetworkInfo = () => {
    switch (chainId) {
      case 420420422: // Passet Hub
        return { symbol: 'PAS', decimals: 10, name: 'Passet Hub' }
      case 420420418: // Kusama Asset Hub
        return { symbol: 'KSM', decimals: 12, name: 'Kusama Asset Hub' }
      case 420420421: // Westend
        return { symbol: 'WND', decimals: 12, name: 'Westend Network' }
      case 1: // Mainnet
        return { symbol: 'ETH', decimals: 18, name: 'Ethereum Mainnet' }
      default:
        return { symbol: 'ETH', decimals: 18, name: 'Unknown Network' }
    }
  }

  const networkInfo = getNetworkInfo()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const to = formData.get('address') as Hex
    const value = formData.get('value') as string

    // Use parseUnits with network-specific decimals
    const parsedValue = parseUnits(value, networkInfo.decimals)
    sendTransaction({ to, value: parsedValue })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Calculate step for input based on decimals
  const inputStep = 1 / Math.pow(10, networkInfo.decimals)

  return (
    <div>
      <h2>Send Transaction</h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        Network: {networkInfo.name} | Currency: {networkInfo.symbol} | Decimals: {networkInfo.decimals}
      </p>
      <form onSubmit={submit}>
        <input
          name="address"
          placeholder="Recipient Address (0x...)"
          required
          style={{ width: '300px', marginBottom: '10px', padding: '8px' }}
        />
        <br />
        <input
          name="value"
          placeholder={`Amount (${networkInfo.symbol})`}
          type="number"
          step={inputStep}
          min="0"
          required
          style={{ width: '200px', marginBottom: '10px', padding: '8px' }}
        />
        <br />
        <button
          disabled={isPending}
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: isPending ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isPending ? 'not-allowed' : 'pointer'
          }}
        >
          {isPending ? 'Confirming...' : `Send ${networkInfo.symbol}`}
        </button>
      </form>

      {hash && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <strong>Transaction Hash:</strong>
          <br />
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>{hash}</code>
        </div>
      )}

      {isConfirming && (
        <div style={{ marginTop: '10px', color: '#ff8c00' }}>
          ⏳ Waiting for confirmation...
        </div>
      )}

      {isConfirmed && (
        <div style={{ marginTop: '10px', color: '#00cc00' }}>
          ✅ Transaction confirmed!
        </div>
      )}

      {error && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px', color: '#cc0000' }}>
          <strong>Error:</strong> {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  )
}