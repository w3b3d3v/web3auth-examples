import { myTokenModuleMyTokenAbi } from "../generated";
import {
  useWriteContract,
  useAccount,
  usePublicClient,
  useChainId,
} from "wagmi";

import { useState, useEffect } from "react";

export function Mint(params: {
  contractAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  isOwner: boolean;
  decimals: number;
  symbol: string;
}) {
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState<`0x${string}`>(
    userAddress || "0x932217f9faf715808c1f76eA9EeAb7026806C963"
  );

  useEffect(() => {
    if (userAddress) {
      setAddress(userAddress);
    }
  }, [userAddress]);

  const { writeContract, status, data, error } = useWriteContract();

  return (
    <div className="border rounded-md my-5 mx-2 p-2 w-fit inline-block">
      <h3 className="px-2 block mb-2 font-bold text-lg">
        Mint {params.symbol}s
      </h3>
      <div className="text-right my-2">
        <label htmlFor="address" className="px-2 block mb-2 inline-block">
          Address
        </label>
        <input
          id="address"
          value={address}
          placeholder="0x..."
          onChange={(e) => setAddress(e.target.value as `0x${string}`)}
          disabled={status === "pending"}
          className="
            border rounded-md padding-1 pl-2 h-10 w-400
            focus:ring-2 focus:ring-inset focus:ring-indigo-600
          "
        />
      </div>
      <div className="text-right my-2">
        <label htmlFor="amount" className="px-2 block mb-2 inline-block">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          placeholder="0"
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={status === "pending"}
          className="
            border rounded-md padding-1 pl-2 h-10 w-400
            focus:ring-2 focus:ring-inset focus:ring-indigo-600
          "
        />
      </div>

      <button
        onClick={async () => {
          if (!userAddress) return;
          try {
            const value = BigInt(amount) * 10n ** BigInt(params.decimals);
            // Precompute fee and limits to avoid wallet estimation issues
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
                    // Encode calldata for the mint(address,uint256)
                    const selector = "0x40c10f19";
                    const pad = (s: string) =>
                      s.replace(/^0x/, "").padStart(64, "0");
                    const calldata =
                      selector + pad(address) + pad(value.toString(16));
                    return calldata as `0x${string}`;
                  })(),
                })
                .catch(() => undefined),
            ]);

            writeContract({
              chainId,
              address: params.contractAddress,
              abi: myTokenModuleMyTokenAbi,
              functionName: "mint",
              args: [address, value],
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
        disabled={status === "pending" || amount <= 0 || !params.isOwner}
        className="
        my-0 mx-3 h-10 py-0
        focus:ring-2 focus:ring-inset focus:ring-indigo-600
      ">
        Mint{" "}
        {status === "pending"
          ? "⏳"
          : status === "success"
          ? "✅"
          : status === "error"
          ? "❌"
          : ""}
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
          Transaction successful! Hash: {data}
        </div>
      )}

      {!params.isOwner && (
        <div style={{ color: "orange", fontSize: "12px", marginTop: "6px" }}>
          You are not the owner/minter. Mint may revert on-chain.
        </div>
      )}
    </div>
  );
}