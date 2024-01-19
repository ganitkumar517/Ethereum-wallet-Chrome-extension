import React, { useEffect, useState } from 'react'
import { ethers, formatEther } from 'ethers';

export default function AccountInfo({ apiKey }) {
    const [balance, setBalance] = useState(null);
    const ownerAddress = "0x994b342dd87fc825f66e51ffa3ef71ad818b6893";
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`);
                const balanceWei = await provider.getBalance(ownerAddress);
                const balanceEth = parseFloat(formatEther(balanceWei)).toFixed(4);
                setBalance(balanceEth);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBalance();
    }, []);
    return (
        <div className='account'>
            <h3>Balance</h3>
            <h2>{balance}</h2>
        </div>
    )
}
