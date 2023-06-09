import { Alchemy } from 'alchemy-sdk';
import { BlockData } from '../../types/BlockData';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY
};

const alchemy = new Alchemy(settings);

export async function getBlockNumber(): Promise<number> {
  const blockNumber = await alchemy.core.getBlockNumber();
  return blockNumber;
}

export async function getBlock(blockNumber: number): Promise<BlockData> {
  const blockData = await alchemy.core.getBlock(blockNumber);
  return blockData as BlockData;
}

export async function getTransaction(txHash: string) {
  const txData = await alchemy.transact.getTransaction(txHash);
  return txData;
}

export async function getEtherBalance(address: string) {
  const ethBalance = await alchemy.core.getBalance(address);
  return ethBalance;
}

export async function getTokenBalances(address: string) {
  const tokenBalances = await alchemy.core.getTokenBalances(address);
  return tokenBalances;
}

export async function getTokenMetadata(address: string) {
  const metadata = await alchemy.core.getTokenMetadata(address);
  return metadata;
}