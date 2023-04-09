import { useState, useEffect } from 'react';
import { getBlockNumber, getBlock } from './api/alchemy';
import { Alchemy } from 'alchemy-sdk';
import styles from '../styles/Home.module.css';
import { BlockData } from '../types/BlockData';
import delay from '../utils/delay';
import Block from '../components/Block';
import { SquareLoader } from 'react-spinners';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY
};
const alchemy = new Alchemy(settings);

export default function Home() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // On initial render, load 6 most recently mined blocks
  useEffect(() => {

    async function getInitialBlocks() {
      // Fetch most recent block number
      const latestBlock = await getBlockNumber();

      // Calculate 5 previous blocks and fetch data for all 6 from Alchemy
      const blockNumbers = Array.from({ length: 6 }, (_, i) => latestBlock - i).reverse();

      const fetchedBlocks = [];
      for (const blockNumber of blockNumbers) {
        const blockData = await getBlock(blockNumber);
        fetchedBlocks.push(blockData);
        await delay(250);
      }

      // return fetchedBlocks;
      setBlocks(fetchedBlocks);
      setLoading(false);
    }
    getInitialBlocks();

    // Subscribe to websocket to get newly mined blocks, update our state variable array
    const subscription = alchemy.ws.on("block", async (blockNumber) => {
      const blockData = await getBlock(blockNumber);

      setBlocks((prevBlocks) => [...prevBlocks.slice(1), blockData]);

    });

    // Clean up the websocket connection
    return () => {
      if (subscription) {
        alchemy.ws.removeAllListeners;
      }
    }
  }, [])

  console.log('Home component rendered');

  return (
    <div className={styles.container}>
      <div className={styles.top} />
      <div className={styles.middle}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <h2 className={styles.loadingText}>Loading blocks...</h2>
          <SquareLoader color='#769fcd'/>
        </div>
        ) : (
          blocks.map((blockData, i) => (
            <div
              className={`${styles.blockPosition} ${i === 0 ? styles.firstBlock : ''}`}
              key={`${blockData.number}-${i}`}
              id={`${i}`}
            >
              <Block blockData={blockData} />
            </div>
          ))
        )}
      </div>
      <div className={styles.bottom}>
      </div>
    </div>
  );
};