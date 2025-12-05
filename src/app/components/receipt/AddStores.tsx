"use client";
import { userInfo } from "node:os";
import { instance } from "../lib/Endpoint"
import { useState } from "react";
import { shopper } from "../lib/Shopper";

type ListedStore = {
	address: string;
	"store-uuid": string;
}

type ListedChain = {
	"name": string;
	"url": string;
	"chain-uuid": string;
	stores: ListedStore[]
};

export default function AddStores({chains, fetchChains}: {chains: ListedChain[], fetchChains: () => void}) {
	let [ addChainModal, setAddChainModal ] = useState(false);
	let [ addStoreModal, setAddStoreModal ] = useState("");

	let [ chainModalName, setChainModalName ] = useState("");
	let [ chainModalURL, setChainModalURL ] = useState("");

	let [ storeAddress, setStoreAddress ] = useState("");

	const getChainModal = function () {
		setAddChainModal(true);
		setChainModalName("");
		setChainModalURL("");
	}

	const submitChain = async function () {
		setAddChainModal(false);

		const payload = {
			"store-chain-url": chainModalURL,
			"store-chain-name": chainModalName
		};

		console.log("payload");

		instance.post("add-chain", payload)
			.then(() => {
				setAddChainModal(false);
				setChainModalName("");
				setChainModalURL("");
				fetchChains();
			})
	}

	const getStoreModal = function (chain: ListedChain) {
		setAddStoreModal(chain["chain-uuid"]);
		setStoreAddress("");
	}

	const submitStore = async function (chain_uuid: string) {
		const payload = {
			"store-chain-uuid": chain_uuid,
			"store-address": storeAddress
		};

		console.log("Add store is not deployed YET")
		return;

		instance.post("add-chain", payload)
			.then(() => {
				// setAddStoreModal("");
				// setStoreAddress("");
				// fetchChains();
			})
	}

	return (
		<div>
			{addChainModal ? <div>
				<label>Chain name: </label>
				<input type="text" placeholder="Chain Name" onChange={(e) => { setChainModalName(e.target.value) }}/>
				<label>Chain URL: </label>
				<input type="text" placeholder="https://url.com" onChange={(e) => { setChainModalURL(e.target.value) }}/>
				<button onClick={submitChain}>Submit New Chain</button>
			</div> : <></>}

			<button onClick={() => {
				getChainModal();
			}}>Add Chain</button>
			{chains.map((chain) => {
				return <div>
					<p><strong>{chain.name}</strong></p>
					<p><a href={chain.url}>Website</a></p>
					{addStoreModal == chain["chain-uuid"] ? <div>
						<label>Store address: </label>
						<input type="text" placeholder="Store Address" onChange={(e) => { setStoreAddress(e.target.value) }}/>
						<button onClick={() => { submitStore(addStoreModal) }}>Submit New Store</button>
					</div> : <></>}
					<button onClick={() => {
						getStoreModal(chain);
					}}>Add Store</button>
				</div>
			})}
		</div>
	)
}
