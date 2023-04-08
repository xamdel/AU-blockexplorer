import { BigNumber } from "@ethersproject/bignumber";

export interface BlockData {
    hash: string;
    parentHash: string;
    number: number;
    timestamp: number;
    nonce: string;
    difficulty: null | number;
    gasLimit: BigNumber;
    gasUsed: BigNumber;
    miner: string;
    extraData: string;
    transactions: string[];
    baseFeePerGas?: BigNumber | null | undefined;
    _difficulty: BigNumber;
}