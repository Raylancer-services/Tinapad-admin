import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import {configureStore} from '@reduxjs/toolkit';
import Slice from './reducer'
import {
	UseWalletProvider
  } from 'use-wallet'
const store = configureStore({reducer: Slice.reducer});

ReactDOM.render(
	// <UseWalletProvider
	// 	// autoConnect
	// 	chainId={3}
	// 	connectors={{
	// 	injected: {
	// 		chainId: [1, 3,4, 5, 6, 56, 97, 250,4002],
	// 	},
	// 	fortmatic: {
	// 		apiKey: '',
	// 	},
	// 	portis: {
	// 		dAppId: ''
	// 	},
	// 	walletconnect: {
	// 		rpc: {
	// 		1: 'https://mainnet.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1',
	// 		3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
	// 		4: 'https://rinkeby.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1',
	// 		5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
	// 		6: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
	// 		56: "http://185.64.106.129/api/rpc/bsc",
	// 		97: "http://185.64.106.129/api/rpc/bsctest",
	// 		250: "https://rpc.ftm.tools/",
	// 		4002: "https://rpc.testnet.fantom.network/"

	// 		}
	// 	}
	// 	}}
	// >
	<UseWalletProvider
	connectors={{
		injected: {
			chainId: [1, 3,4, 5, 6, 56, 97, 250,4002],
		},
		walletconnect: {
			rpcUrl:'https://mainnet.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1'
		},
		portis: { dAppId: "nft-minting" },
	}}>
		<Provider store = {store}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</Provider>
	</UseWalletProvider>,
	document.getElementById('root')
);

reportWebVitals();
