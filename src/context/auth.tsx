import React from 'react';
import Web3 from 'web3';

type AuthProps = {
    address: string;
    verifyMetaMask: Function;
};

export const AuthContext = React.createContext({} as AuthProps);

const AuthProvider = (props: any) => {

    const [address, setAddress] = React.useState(null);

    window['web3'] = null;

    const handleAddressChanged = (accounts) => {
        if (typeof window['ethereum'] !== 'undefined') {
            window.location.reload(false);
            window.location.href = "/";
            setAddress(window['ethereum'].selectedAddress);
        }
    }
    const handleNetworkChanged = (networkId) => {
        console.log('networkId :>> ', networkId);
        window.location.reload(false);
        window.location.href = "/";
    }

    function verifyMetaMask(cb){
        if (typeof window['ethereum'] !== 'undefined') {
            window['web3'] = new Web3(window['ethereum']);
            window['ethereum'].on('accountsChanged', (accounts) => handleAddressChanged(accounts));
            window['ethereum'].on('networkChanged', networkId => handleNetworkChanged(networkId));
            setAddress(window['ethereum'].selectedAddress);
        }
        else if (window['web3']) {
            window['web3'] = new Web3(window['web3'].currentProvider);
        }
        else {
            window['web3'] = null;
        }
        setTimeout(cb, 100);
    }

    return (
        <AuthContext.Provider
            value={{
                address,
                verifyMetaMask
            }}
        >
            <>{props.children}</>
        </AuthContext.Provider>
    );
};

export default AuthProvider;
