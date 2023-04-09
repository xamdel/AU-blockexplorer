import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTransaction } from "../api/alchemy";
import Link from "next/link";
import { Transaction } from "../../types/Transaction";
import styles from '../../styles/TransactionPage.module.css';

export default function TransactionPage() {
    const router = useRouter();
    const { txHash } = router.query;
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        if (typeof txHash === "string") {
            const fetchTx = async () => {
                const tx = await getTransaction(txHash);
                setTransaction(tx);
            };
            fetchTx();
        }
    }, [txHash]);

    if (!transaction) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <table className={styles.txTable}>
                <thead>
                    <tr>
                        <th colSpan={2}>Transaction {transaction.hash}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>Hash</b></td>
                        <td>{transaction.hash}</td>
                    </tr>
                    <tr>
                        <td><b>From</b></td>
                        <td>{transaction.from}</td>
                    </tr>
                    <tr>
                        <td><b>Block Number</b></td>
                        <td>{transaction.blockNumber}</td>
                    </tr>
                    <tr>
                        <td><b>Block Hash</b></td>
                        <td>{transaction.blockHash}</td>
                    </tr>
                    <tr>
                        <td><b>Timestamp</b></td>
                        <td>{transaction.timestamp}</td>
                    </tr>
                    <tr>
                        <td><b>Confirmations</b></td>
                        <td>{transaction.confirmations}</td>
                    </tr>
                    <tr>
                        <td><b>Raw</b></td>
                        <td>{transaction.raw}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}