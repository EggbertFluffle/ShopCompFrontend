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

	let [chainModalName, setChainModalName] = useState("");
	let [chainModalURL, setChainModalURL] = useState("");

	let [storeAddress, setStoreAddress] = useState("");

	const getChainModal = function () {
		setAddChainModal(true);
		setChainModalName("");
		setChainModalURL("");
	};

	const submitChain = async function () {
		setAddChainModal(false);

		const payload = {
			"store-chain-url": chainModalURL,
			"store-chain-name": chainModalName,
		};

		console.log("payload");

		instance.post("add-chain", payload).then(() => {
			setAddChainModal(false);
			setChainModalName("");
			setChainModalURL("");
			fetchChains();
		});
	};

	const onClose = () => {
		setAddChainModal(false);
		setChainModalName("");
		setChainModalURL("");

		setAddStoreModal("");
		setStoreAddress("");
	};

	const getStoreModal = function (chain: ListedChain) {
		setAddStoreModal(chain["chain-uuid"]);
		setStoreAddress("");
	};

	const submitStore = async function (chain_uuid: string) {
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
		<div>
			{addChainModal ? (
				<div className="modal-overlay">
					<div className="new-chain-section modal-box">
						<div className="chain-inputs">
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
									<label>{chain.name} Store address: </label>
									<input
										className="store-info-field"
										type="text"
										placeholder="Store Address"
										onChange={(e) => {
											setStoreAddress(e.target.value);
										}}
									/>
									<div>
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
