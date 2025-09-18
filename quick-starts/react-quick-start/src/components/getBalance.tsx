import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";

export function Balance() {
  const { address } = useAccount();
  const chainId = useChainId();

  const { data, isLoading, error } = useBalance({ address });
  console.log("user data: ", data);

  // Get decimals from the current chain's native currency
  const getNetworkDecimals = (chainId: number) => {
    switch (chainId) {
      case 1: // Ethereum mainnet
        return 18;
      case 420420422: // PassetHub
        return 12;
      case 420420418:
        return 12;
      default:
        return 18; // Default fallback
    }
  };

  const networkDecimals = getNetworkDecimals(chainId);

  return (
    <div>
      <h2>Balance</h2>
      <div>
        {data?.value !== undefined &&
          `${formatUnits(data.value, networkDecimals)} ${data.symbol}`}{" "}
        {isLoading && "Loading..."} {error && "Error: " + error.message}
      </div>
    </div>
  );
}
