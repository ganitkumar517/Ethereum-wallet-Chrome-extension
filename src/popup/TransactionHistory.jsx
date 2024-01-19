import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = ({ apiKey }) => {
    const [transactionCount, setTransactionCount] = useState(null);

    useEffect(() => {
        const fetchBlockTransactionCount = async () => {
            try {
                const options = {
                    method: 'POST',
                    url: `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
                    headers: { accept: 'application/json', 'content-type': 'application/json' },
                    data: {
                        id: 1,
                        jsonrpc: '2.0',
                        method: 'alchemy_getTransactionReceipts',
                        params: ['latest', 10],
                    },
                };
                const response = await axios.request(options);
                setTransactionCount(response.data.result);
            } catch (error) {
                console.error('Error fetching block transaction count:', error);
            }
        };

        fetchBlockTransactionCount();
    }, []);

    return (
        <div>
            <h3>Transaction History</h3>
            {transactionCount !== null ? (
                <p>{transactionCount}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default TransactionHistory;
