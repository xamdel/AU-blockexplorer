import { BlockData } from "../types/BlockData";
import styles from '../styles/Home.module.css';

interface BlockProps {
    blockData: BlockData;
}

export default function Block({ blockData }: BlockProps) {
    const { number } = blockData;

    return (
        <div id={`$number`} className={styles.block}>
            <div>Block # {number}</div>
        </div>
    )
}