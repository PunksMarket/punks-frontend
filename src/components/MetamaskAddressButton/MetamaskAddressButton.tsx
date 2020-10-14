import React, {useContext, useState, useEffect} from 'react';
import Button from "../Button/Button";
import {AuthContext} from "../../context/auth";

function MetamaskAddressButton() {

    const [connecting, setConnecting] = useState('');
    const {address, verifyMetaMask} = useContext(AuthContext);

    useEffect(() => {
        verifyMetaMask();
    });

    const connectMetaMask = async () => {

        if (connecting) {
            return;
        }

        const ethereum = window['ethereum'];

        if (typeof ethereum === 'undefined') {

            alert(
                <div>Please install metamask by
                    <a href="https://metamask.io" target="_blank">clicking here</a>
                </div>
            );

            return;
        }

        if (ethereum.networkVersion !== '3') {
            alert('Please select ropsten testnet to proceed!');
            return;
        }

        if (ethereum.selectedAddress === null) {
            try {
                console.log('mohan - ', 'ethereum.request');
                await ethereum.request({method: 'eth_requestAccounts'});
                console.log('mohan - done - ', 'ethereum.request');
            } catch (err) {
                //console.log('err :>> ', err);
            }
        }
    };

    const navigateToMetaMaskAccount = async () => {
        const link = `https://ropsten.etherscan.io/address/${address}`;
        window.open(link, '_blank');
    };

    return (
        !!address ? (
            <Button color="default" onClick={navigateToMetaMaskAccount}>
                {`${address.substring(0, 5)}...${address.substring(address.length - 3, address.length)}`}
            </Button>
        ) : (
            <Button onClick={connectMetaMask}>Connect to a Metamask</Button>
        )
    );
}

export default MetamaskAddressButton;