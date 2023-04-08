import { useState, useEffect } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';
import styles from '../styles/Home.module.css';
import { BlockData } from '../types/BlockData';
import Block from '../components/Block';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY
};
const alchemy = new Alchemy(settings);

export default function Home() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  // delay function because setTimeout is wonky inside async blocks
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // On initial render, load 6 most recently mined blocks
  useEffect(() => {
    console.log('Home component mounted');

    async function getInitialBlocks() {
      // Fetch most recent block number
      const latestBlock = await alchemy.core.getBlockNumber();
      console.log({ latestBlock });

      // Calculate 5 previous blocks and fetch data for all 6 from Alchemy
      const blockNumbers = Array.from({ length: 6 }, (_, i) => latestBlock - i).reverse();
      console.log({ blockNumbers });

      const fetchedBlocks = [];
      for (const blockNumber of blockNumbers) {
        const blockData = await alchemy.core.getBlock(blockNumber);
        fetchedBlocks.push(blockData);
        await delay(250);
      }

      console.log({ fetchedBlocks });
      // return fetchedBlocks;
      setBlocks(fetchedBlocks);
    }
    getInitialBlocks();

    // Subscribe to websocket to get newly mined blocks, animate blocks, update our state variable array
    // Subscribe to websocket to get newly mined blocks, update our state variable array
    const subscription = alchemy.ws.on("block", async (blockNumber) => {
      const blockData = await alchemy.core.getBlock(blockNumber);

      setBlocks((prevBlocks) => [...prevBlocks.slice(1), blockData]);

    });


    // Clean up the websocket connection
    return () => {
      if (subscription) {
        alchemy.ws.off;
      }
    }
  }, [])

  console.log('Home component rendered');

  return (
    <div className={styles.container}>
      <div className={styles.top} />
      <div className={styles.middle}>
        {blocks.map((blockData, i) => (
          <div
            className={styles.blockPosition}
            key={`${blockData.number}-${i}`}
            id={`${i}`}
          >
            <Block blockData={blockData} />
          </div>
        ))}

      </div>
      <div className={styles.bottom}>
      </div>
    </div>
  );
};