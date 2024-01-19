import React, { useState, useEffect } from 'react';
import './Popup.css';
import { Alchemy, Network } from "alchemy-sdk";
import axios from 'axios';
import AccountInfo from './AccountInfo';
import TransactionForm from './TransactionForm';

function Popup() {
    const [accountInfo, setAccountInfo] = useState([]);
    const [apiKey, setApiKey] = useState("hV8IPjtpCKf4lpHfNE12ZD940DykzQfX")
    const [decodedValues, setDecodedValues] = useState([]);
    const [newApiKay, setNewApiKey] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const config = {
                apiKey: apiKey,
                network: Network.ETH_MAINNET,
            };
            const alchemy = new Alchemy(config);

            const ownerAddress = "0x994b342dd87fc825f66e51ffa3ef71ad818b6893";

            try {
                const data = await alchemy.core.getTokenBalances(ownerAddress);
                setAccountInfo(data);
                decodeValues(data.tokenBalances);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };

        const decodeValues = async (tokenBalances) => {
            const fetchURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
            const decoded = await Promise.all(tokenBalances.map(async (ele) => {
                const metadataParams = {
                    "jsonrpc": "2.0",
                    "method": "alchemy_getTokenMetadata",
                    "params": [`${ele.contractAddress}`],
                    "id": 42
                };

                const metadataConfig = {
                    method: 'post',
                    url: fetchURL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: metadataParams
                };

                try {
                    const response = await axios(metadataConfig);
                    let metadata = response.data.result;
                    const tokenName = metadata.name + "(" + metadata.symbol + ")";
                    const tokenBalance = ele.tokenBalance / Math.pow(10, metadata.decimals);
                    return { name: tokenName, balance: tokenBalance };
                } catch (error) {
                    console.error('Error fetching metadata:', error);
                    return null;
                }
            }));
            setDecodedValues(decoded.filter(Boolean));
        };
        fetchData();
    }, [apiKey]);
    return (
        <>
            <div style={{ width: "100%", textAlign: 'center' }}>
                <h2>Ethereum Wallet</h2>
                <div>
                    <AccountInfo apiKey={apiKey} />
                </div>
            </div>
            <div>
                <TransactionForm apiKey={apiKey} />
            </div>
            <div>
            </div>
            <h2>Token Balances</h2>
            <table style={{ border: "1px solid black", borderRadius: "20px", padding: "20px" }}>
                <thead>

                    <th style={{ textAlign: "start" }}>Name</th>
                    <th style={{ textAlign: "start" }}>Balance</th>

                </thead>
                <tbody>
                    {decodedValues.map((decoded, index) => (
                        <tr key={index}>
                            <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: "250px", marginRight: "100px" }}>{decoded.name}</div>
                            <td>{decoded.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form>
            </form>
            <label htmlFor="privateKey">Import Existing Account (Api Key):</label>
            <input type="text" id="privateKey" value={newApiKay} onChange={(e) => setNewApiKey(e.target.value)} />
            <button type="button" onClick={() => setApiKey(newApiKay)}>
                Import Account
            </button>
        </>
    );
}

export default Popup;
