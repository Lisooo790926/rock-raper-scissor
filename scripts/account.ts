import {
    LocalAccountSigner,
    type SmartAccountSigner,
    sepolia,
  } from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { ETH_PROVIDER_API_KEY, PRIVATE_KEY } from "./constants";

export async function createAcount() {
  const signer: SmartAccountSigner = LocalAccountSigner.privateKeyToAccountSigner(`0x${PRIVATE_KEY}`);
  const account = await createModularAccountAlchemyClient({
      apiKey: ETH_PROVIDER_API_KEY,
      chain: sepolia,
      signer
  });

  return account
}
