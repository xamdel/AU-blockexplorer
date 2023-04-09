
export interface Transaction {
    hash: string;
    from: string;
    blockNumber?: number;
    blockHash?: string;
    timestamp?: number;
    confirmations: number;
    raw?: string;
}