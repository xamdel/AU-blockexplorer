import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getBlock } from "../api/alchemy";
import { BlockData } from "../../types/BlockData";
import styles from '../../styles/BlockPage.module.css';

export default function BlockPage() {
    const router = useRouter();
    const { blockNumber } = router.query;
    const [blockData, setBlockData] = useState<BlockData | null>(null);
    const [transactionsToShow, setTransactionsToShow] = useState(50);



    useEffect(() => {
        if (typeof blockNumber === "string") {
            const fetchData = async () => {
                const data = await getBlock(parseInt(blockNumber));
                setBlockData(data);
            };
            fetchData();
        }


    }, [blockNumber]);

    const loadMoreTransactions = () => {
        setTransactionsToShow(transactionsToShow + 50);
    };

    if (!blockData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <h1>Block {blockData.number}</h1>
                <h3>{blockData.hash}</h3>
                <h3>Gas used: {blockData.gasUsed.toString()}</h3>
                <p>Proposed by {blockData.miner}</p>
                <p>at {(new Date(blockData.timestamp * 1000)).toString()}</p>
                <p>Extra data: {blockData.extraData}</p>
            </div>
            <div className={styles.main}>
                <h2>Transactions</h2>
                {blockData.transactions.slice(0, transactionsToShow).map((tx, index) => (
                    <p key={index}>{tx}</p>
                ))}
                <button className={styles.button} onClick={loadMoreTransactions}>Load more transactions</button>
            </div>
        </div>
    )
};