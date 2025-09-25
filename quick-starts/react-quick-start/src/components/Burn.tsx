import { fakeUsdtModuleFakeUsdtAbi } from "../generated";
import {
  useWriteContract,
  useAccount,
  usePublicClient,
  useChainId,
} from "wagmi";

import { useState } from "react";

export function Burn(params: {
  contractAddress: `0x${string}`;
  decimals: number;
  symbol: string;
  userBalance: bigint;
}) {
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const [amount, setAmount] = useState(0);

  const { writeContract, status, data, error } = useWriteContract();

  const formatBalance = (balance: bigint): string => {
    const divisor = 10n ** BigInt(params.decimals);
    return (Number(balance) / Number(divisor)).toFixed(params.decimals);
  };

  return (
    <div className="border rounded-md my-5 mx-2 p-2 w-fit inline-block">
      <h3 className="px-2 block mb-2 font-bold text-lg">
        Burn {params.symbol}s
      </h3>

      <div className="px-2 mb-3 text-sm">
        Your balance: <span className="font-semibold">{formatBalance(params.userBalance)} {params.symbol}</span>
      </div>

      <div className="text-right my-2">
        <label htmlFor="burnAmount" className="px-2 block mb-2 inline-block">
          Amount to Burn
        </label>
        <input
          id="burnAmount"
          type="number"
          placeholder="0"
          max={formatBalance(params.userBalance)}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={status === "pending"}
          className="
            border rounded-md padding-1 pl-2 h-10 w-400
            focus:ring-2 focus:ring-inset focus:ring-red-600
          "
        />
      </div>

      <button
        onClick={async () => {
          if (!userAddress) return;
          try {
            const value = BigInt(amount) * 10n ** BigInt(params.decimals);

            // Check if user has enough balance
            if (value > params.userBalance) {
              alert("Cannot burn more than your balance!");
              return;
            }

            // Precompute gas parameters
            const [gasPrice, nonce, gas] = await Promise.all([
              publicClient?.getGasPrice().catch(() => undefined),
              publicClient
                ?.getTransactionCount({ address: userAddress })
                .catch(() => undefined),
              publicClient
                ?.estimateGas({
                  account: userAddress,
                  to: params.contractAddress,
                  data: await (async () => {
                    // Encode calldata for burn(uint256)
                    const selector = "0x42966c68";
                    const pad = (s: string) =>
                      s.replace(/^0x/, "").padStart(64, "0");
                    const calldata = selector + pad(value.toString(16));
                    return calldata as `0x${string}`;
                  })(),
                })
                .catch(() => undefined),
            ]);

            writeContract({
              chainId,
              address: params.contractAddress,
              abi: fakeUsdtModuleFakeUsdtAbi,
              functionName: "burn",
              args: [value],
              // Hint wagmi/viem for legacy by setting gasPrice
              ...(gasPrice ? { gasPrice, type: "legacy" as const } : {}),
              ...(gas ? { gas } : {}),
              ...(nonce !== undefined ? { nonce } : {}),
              account: userAddress,
            });
          } catch (e) {
            console.error(e);
          }
        }}
        disabled={status === "pending" || amount <= 0 || params.userBalance === 0n}
        className="
        my-0 mx-3 h-10 py-0 bg-red-500 text-white rounded-md px-4
        focus:ring-2 focus:ring-inset focus:ring-red-600
        disabled:bg-gray-300 disabled:cursor-not-allowed
      ">
        Burn{" "}
        {status === "pending"
          ? "⏳"
          : status === "success"
          ? "✅"
          : status === "error"
          ? "❌"
          : "🔥"}
      </button>

      {status === "error" && error && (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            marginTop: "8px",
            padding: "8px",
          }}>
          Error: {error.message}
        </div>
      )}

      {status === "success" && data && (
        <div
          style={{
            color: "green",
            fontSize: "14px",
            marginTop: "8px",
            padding: "8px",
          }}>
          Burn successful! Hash: {data}
        </div>
      )}

      <div style={{ color: "gray", fontSize: "12px", marginTop: "6px" }}>
        🔥 You can only burn your own tokens
      </div>
    </div>
  );
}