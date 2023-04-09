import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEtherBalance, getTokenBalances, getTokenMetadata } from "../api/alchemy";
import { Utils } from 'alchemy-sdk';
import { TokenBalances } from "../../types/TokenBalances";
import styles from '../../styles/AddressPage.module.css';

interface FormattedToken {
    name: string | null;
    symbol: string | null;
    balance: number;
}

export default function AddressPage() {
    const router = useRouter();
    const { address } = router.query;
    const [ethBalance, setEthBlance] = useState(0);
    const [tokens, setTokens] = useState<FormattedToken[]>([]);

    useEffect(() => {
        // Get ETH balance for address
        if (typeof address === "string") {
            const fetchBalance = async () => {
                const balance = await getEtherBalance(address);
                setEthBlance(parseFloat(Utils.formatUnits(balance, 18)));
            };
            fetchBalance();
        }

        // Get token balances for address
        if (typeof address === "string") {
            const fetchTokenBalances = async () => {
                const balances: TokenBalances = await getTokenBalances(address);

                // Remove tokens with zero balance
                const nonZeroBalances = balances.tokenBalances.filter((token) => {
                    return token.tokenBalance !== "0";
                });

                const tokenBalancesFormatted = [];

                for (let token of nonZeroBalances) {
                    // Get metadata of token
                    const metadata = await getTokenMetadata(token.contractAddress);

                    // Filter out the most scammy of scamcoins
                    if (metadata.symbol && metadata.symbol.toLowerCase().includes("claim")) {
                        continue;
                    }

                    // Compute token balance in human-readable format using Alchemy SDK utils
                    let balance = metadata.decimals !== null ? Utils.formatUnits(token.tokenBalance as string, metadata.decimals) : token.tokenBalance;

                    const tokenData = {
                        name: metadata.name,
                        symbol: metadata.symbol,
                        balance: balance ? parseFloat(balance) : 0,
                    };

                    tokenBalancesFormatted.push(tokenData);
                }

                setTokens(tokenBalancesFormatted);
            };
            fetchTokenBalances();
        }
    }, [address])

    if (!address || !ethBalance || tokens.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Address: {address}</h1>
                <h2>ETH Balance: {ethBalance}</h2>
            </div>
            <div className={styles.body}>
            <h3>Token Balances</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token, index) => (
                        <tr key={index}>
                            <td>{token.name || 'N/A'}</td>
                            <td>{token.symbol || 'N/A'}</td>
                            <td>{token.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            
        </div>
    );

};
