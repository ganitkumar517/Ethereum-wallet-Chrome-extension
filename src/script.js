import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "hV8IPjtpCKf4lpHfNE12ZD940DykzQfX",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);