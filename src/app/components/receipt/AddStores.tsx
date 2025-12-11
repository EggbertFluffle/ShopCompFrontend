"use client";
import "./page.css";

import { instance } from "../lib/Endpoint";
import { useState } from "react";

type ListedStore = {
	address: string;
	"store-uuid": string;
};

type ListedChain = {
	name: string;
	url: string;
	"chain-uuid": string;
	stores: ListedStore[];
};

export default function AddStores({
	chains,
	fetchChains,
}: {
	chains: ListedChain[];
	fetchChains: () => void;
}) {
	let [addChainModal, setAddChainModal] = useState(false);
	let [addStoreModal, setAddStoreModal] = useState("");
	let [storeModalError, setStoreModalError] = useState("");

	let [chainModalName, setChainModalName] = useState("");
	let [chainModalURL, setChainModalURL] = useState("");
	let [chainModalError, setChainModalError] = useState("");

	let [storeAddress, setStoreAddress] = useState("");

	const getChainModal = function () {
		setAddChainModal(true);
		setChainModalName("");
		setChainModalURL("");
	};

	const submitChain = async function () {
		if(chainModalName == "" || chainModalURL == "") {
			setChainModalError("Please give a valid chain name and url");
			return;
		}

		const payload = {
			"store-chain-url": chainModalURL,
			"store-chain-name": chainModalName,
		};

		instance.post("add-chain", payload)
			.then(() => {
				setAddChainModal(false);
				setChainModalName("");
				setChainModalURL("");
				setChainModalError("");
				fetchChains();
			}).catch((e) => {
				console.error(e);
			});
	};

	const onClose = () => {
		setAddChainModal(false);
		setChainModalName("");
		setChainModalError("");
		setChainModalURL("");

		setAddStoreModal("");
		setStoreAddress("");
		setStoreModalError("");

		fetchChains();
	};

	const getStoreModal = function (chain: ListedChain) {
		setAddStoreModal(chain["chain-uuid"]);
		setStoreAddress("");
	};

	const submitStore = async function (chain_uuid: string) {
		if(storeAddress == "") {
			setStoreModalError("Please enter a valid address for the new store");
			return;
		}

		const payload = {
			"store-chain-uuid": chain_uuid,
			address: storeAddress,
		};

		console.log(payload);

		instance
			.post("add-store", payload)
			.then(() => {
				setAddStoreModal("");
				setStoreAddress("");
				fetchChains();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<div className="add-stores-container">
			<h2>Store Chains</h2>
			{addChainModal ? (
				<div className="modal-overlay">
					<div className="new-chain-section modal-box">
						<div className="chain-inputs">
							<h2 className="modal-title">Add Chain</h2>
							{chainModalError.length == 0 ?
								<></> :
								<p className="error">{chainModalError}</p>}
							<label>Chain name: </label>
							<input
								className="chain-info-field"
								type="text"
								placeholder="Chain Name"
								onChange={(e) => {
									setChainModalName(e.target.value);
								}}
							/>
						</div>

						<div className="chain-inputs">
							<label>Chain URL: </label>
							<input
								className="chain-info-field"
								type="text"
								placeholder="https://url.com"
								onChange={(e) => {
									setChainModalURL(e.target.value);
								}}
							/>
						</div>
						<div>
							<button className="cancel-button" onClick={onClose}>
								Cancel
							</button>
							<button
								className="submit-chain-button"
								onClick={submitChain}
							>
								Submit New Chain
							</button>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}

			<button
				className="add-chain-button"
				onClick={() => {
					getChainModal();
				}}
			>
				Add New Chain
			</button>
			{chains.map((chain) => {
				return (
					<div className="chain-section" key={chain["chain-uuid"]}>
						<p>
							<a href={chain.url}>{chain.name}</a>
						</p>
						<ul>
							{chain.stores.map((store: ListedStore) => {
								return (
									<li key={store["store-uuid"]}>
										{store.address}
									</li>
								);
							})}
						</ul>
						{addStoreModal == chain["chain-uuid"] ? (
							<div className="modal-overlay">
								<div className="new-store-section modal-box">
									<h2 className="modal-title">Add Store</h2>
									{storeModalError.length == 0 ?
										<></> :
										<p className="error">{storeModalError}</p>}
									<label>{chain.name} Store address: </label>
									<input
										className="store-info-field"
										type="text"
										placeholder="Store Address"
										onChange={(e) => {
											setStoreAddress(e.target.value);
										}}
									/>
									<div className="flex">
										<button
											className="cancel-button"
											onClick={onClose}
										>
											Cancel
										</button>
										<button
											className="submit-store-button"
											onClick={() => {
												submitStore(addStoreModal);
											}}
										>
											Submit New Store
										</button>
									</div>
								</div>
							</div>
						) : (
							<button
								className="add-store-button"
								onClick={() => {
									getStoreModal(chain);
								}}
							>
								Add New Store
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
}
