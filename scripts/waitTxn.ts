import { SendUserOperationResult, SmartAccountClient } from "@alchemy/aa-core";

export async function waitForTxn(scAccount: SmartAccountClient ,result:SendUserOperationResult) {
    const txHash = await scAccount.waitForUserOperationTransaction(result);
    console.log('Transaction hash', txHash);
  
    const userOpReceipt = await scAccount.getUserOperationReceipt(
      result.hash as `0x${string}`
    );
    console.log("\nUser operation receipt: ", userOpReceipt);
  
    const txReceipt = await scAccount.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("\nTransaction receipt: ", txReceipt);

    return txReceipt;
}