import { parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";

import { ETH_PROVIDER_API_KEY, PRIVATE_KEY } from "./constants";

export async function deposit(targetAddress: `0x${string}`, amount: string) {
  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

  const wallet = createWalletClient({
    account: account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ETH_PROVIDER_API_KEY}`),
  });

  const txHash = await wallet.sendTransaction({
    to: targetAddress,
    value: parseEther(amount)
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })

  return await publicClient.waitForTransactionReceipt( { hash: txHash })
}
