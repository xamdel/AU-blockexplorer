import { BlockData } from "../types/BlockData";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';

interface BlockProps {
    blockData: BlockData;
}

export default function Block({ blockData }: BlockProps) {
    const { number } = blockData;
    const gasUsed = blockData.gasUsed.toString();
    const baseFee = blockData.baseFeePerGas
        ? (blockData.baseFeePerGas.toNumber() / 1000000000).toFixed(5)
        : 'N/A';
    const dateProposed = (new Date (blockData.timestamp * 1000)).toString()

    return (
        <Link href={`/block/${number}`}>
                <div id={`$number`} className={styles.block}>
                    <div className={styles.blockHeader}>
                        <h3>Block {number}</h3>
                        <p>{blockData.hash}</p>
                    </div>
                    <div className={styles.blockBody}>
                        <p>Parent: {blockData.parentHash}</p>
                        <p className={styles.transactions}>Transactions: {blockData.transactions.length}</p>
                        <p>Gas Used: {gasUsed}</p>
                        <p>Base Fee: {baseFee} Gwei</p>
                    </div>
                    <div className={styles.blockFooter}>
                        <p>Proposed by {blockData.miner}</p>
                        <p>at {dateProposed}</p>
                    </div>
                </div>
        </Link>
    )
}