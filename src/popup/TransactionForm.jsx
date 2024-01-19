import React, { useState } from 'react';
import { ethers, parseEther, getAddress, parseUnits } from 'ethers';
import TransactionHistory from './TransactionHistory';

export default function TransactionForm({ apiKey }) {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [error, setError] = useState(null);

    const validateInputs = () => {
        try {
            getAddress(recipientAddress);
            parseUnits(transactionAmount, 'ether');
            setError(null);
            return true;
        } catch (validationError) {
            setError(validationError.message);
            return false;
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`);
        const signer = new ethers.Wallet("alcht_54tl1cqMymkd4clRXQmjMSjd4kuIYX", provider);

        try {
            const amountWei = parseEther(transactionAmount);

            const transaction = {
                to: recipientAddress,
                value: amountWei,
            };

            const signedTransaction = await signer.signTransaction(transaction);
            const sentTransaction = await provider.sendTransaction(signedTransaction);

            console.log('Transaction sent:', sentTransaction);
            setTransactionStatus('Transaction sent successfully');

        } catch (error) {
            console.error('Error sending transaction:', error.message);
            setTransactionStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Transaction Form</h2>
            <form onSubmit={handleTransaction}>
                <div>
                    <label htmlFor="recipientAddress">Recipient Address:</label><br />
                    <input
                        type="text"
                        id="recipientAddress"
                        style={{ width: "100%" }}
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="transactionAmount">Transaction Amount (ETH):</label><br />
                    <input
                        type="text"
                        id="transactionAmount"
                        style={{ width: "100%" }}
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">Send Transaction</button>
            </form>
            <TransactionHistory apiKey={apiKey} />
            {transactionStatus && <p>{transactionStatus}</p>}
        </div>
    );
}
