import { myTokenModuleMyTokenAbi } from "../generated";
import { useWriteContract, useAccount } from "wagmi";

import { useState, useEffect } from "react";

export function Mint(params: {
  contractAddress: `0x${string}`,
  ownerAddress: `0x${string}`,
  decimals: number,
  symbol: string,
}) {
  const { address: userAddress } = useAccount();
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState<`0x${string}`>(userAddress || "0x932217f9faf715808c1f76eA9EeAb7026806C963");

  useEffect(() => {
    if (userAddress) {
      setAddress(userAddress);
    }
  }, [userAddress]);

  const { writeContract, status, data, error } = useWriteContract();

  return (
    <div className="border rounded-md my-5 mx-2 p-2 w-fit inline-block">
      <h3 className="px-2 block mb-2 font-bold text-lg">Mint {params.symbol}s</h3>
      <div className="text-right my-2">
        <label htmlFor="address" className="px-2 block mb-2 inline-block">Address</label>
        <input
          id="address"
          value={address}
          placeholder="0x..."
          onChange={(e) => setAddress(e.target.value as `0x${string}`)}
          disabled={status === "pending"}
          className="
            border rounded-md padding-1 pl-2 h-10 w-400
            focus:ring-2 focus:ring-inset focus:ring-indigo-600
          " />
      </div>
      <div className="text-right my-2">
        <label htmlFor="amount" className="px-2 block mb-2 inline-block">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="0"
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={status === "pending"}
          className="
            border rounded-md padding-1 pl-2 h-10 w-400
            focus:ring-2 focus:ring-inset focus:ring-indigo-600
          " />
      </div>

      <button onClick={() => writeContract({
        address: params.contractAddress,
        abi: myTokenModuleMyTokenAbi,
        functionName: "mint",
        args: [address, BigInt(amount) * (10n ** BigInt(params.decimals))]
      })} disabled={status === "pending" || amount <= 0} className="
        my-0 mx-3 h-10 py-0
        focus:ring-2 focus:ring-inset focus:ring-indigo-600
      ">Mint {
        status === "pending" ? "⏳"
          : status === "success" ? "✅"
            : status === "error" ? "❌" : ""
      }
      </button>

      {status === "error" && error && (
        <div style={{ color: 'red', fontSize: '14px', marginTop: '8px', padding: '8px' }}>
          Error: {error.message}
        </div>
      )}

      {status === "success" && data && (
        <div style={{ color: 'green', fontSize: '14px', marginTop: '8px', padding: '8px' }}>
          Transaction successful! Hash: {data}
        </div>
      )}
    </div>
  );
}