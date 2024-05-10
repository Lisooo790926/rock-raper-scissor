import * as dotenv from 'dotenv'

dotenv.config()

export const DEFAULT_PRIVATE_KEY = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? DEFAULT_PRIVATE_KEY;
export const ETH_PROVIDER_API_KEY = process.env.ETH_PROVIDER_API_KEY ?? '';
export const PROVIDER_URL = `https://eth-sepolia.g.alchemy.com/v2/${ETH_PROVIDER_API_KEY}`;
export const DEFAULT_ROCKPC_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
export const DEFAULT_AA_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
export const AA_ADDRESS = process.env.AA_ADDRESS ?? DEFAULT_AA_ADDRESS;
export const ROCK_PAPER_SCISSORS_ADDRESS = process.env.ROCK_PAPER_SCISSORS_ADDRESS ?? DEFAULT_ROCKPC_ADDRESS;