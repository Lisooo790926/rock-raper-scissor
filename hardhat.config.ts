import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const DEFAULT_PRIVATE_KEY =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    local: {
        url: 'http://127.0.0.1:8545',
        blockGasLimit: 12000000,
        accounts: [DEFAULT_PRIVATE_KEY],
    },
    dev: {
        url: `https://sepolia.infura.io/v3/${process.env.ETH_PROVIDER_URL}` ?? '',
        accounts: [process.env.PRIVATE_KEY ?? DEFAULT_PRIVATE_KEY],
    }
  }
};

export default config;
