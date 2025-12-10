import "./page.css";

import { useRef, useState, useEffect } from "react";
//mport OpenAi from 'openai';
import Item from "../lib/Item";
import ReceiptItem from "./ReceiptItem";
import AnalyzeModal from "./AnalyzeModal";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";
import AddStores from "./AddStores";

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

export default function Receipt() {
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]); //GPT
	const [chains, setChains] = useState<ListedChain[]>([]);
	const [storeUUID, setStoreUUID] = useState("");
	const [items, setItems] = useState<Item[]>([]);
	const [receiptError, setReceiptError] = useState("");
	const [analyzingReceipt, setAnalyzingReceipt] = useState(false);

	const fetchChains = () => {
		instance
			.get("get-store-chains")
			.then((response) => {
				const chains = response.data.chains;

				let new_chains: ListedChain[] = [];

				console.log(response);

				for (let chain of chains) {
					new_chains.push({
						name: chain.name,
						url: chain.url,
						"chain-uuid": chain["store-chain-uuid"],
						stores: []
					} as ListedChain);
					for (let store of chain.stores) {
						new_chains[new_chains.length - 1].stores.push({
							address: store.address as string,
							"store-uuid": store["store-uuid"] as string,
						} as ListedStore);
					}
				}

				setChains(new_chains);
			})
			.catch((err) => console.error(err));
	}

	useEffect(() => {
		// I added it again because of the render infinite loop
		fetchChains();
	}, []);

	function removeItem(localID: string) {
		setItems(items.filter((i) => i.localID !== localID));
	}

	//for analyze with ai
	function loadReceipt(parsed: any) {
		//"parsed: any" (source: GPT)
		const loadedItems = parsed.items.map(
			(i) => new Item(
				i.name ?? "UNNAMMED",
				parseFloat(i.price ?? 1.0),
				parseInt(i.quantity ?? 1),
				i.category ?? "UNCATEGORIZED"
			)
		);

		setItems(loadedItems);
		console.log(parsed.date);
		if (parsed.date) setDate(parsed.date);

		setAnalyzingReceipt(false);
	}

	const submitReceipt = () => {
		if (storeUUID == "choose-store" || storeUUID == "") {
			setReceiptError(
				"Please choose a store before submitting a receipt."
			);
			return;
		}

		if (items.length < 1) {
			setReceiptError("Please add at lease one item to the receipt.");
			return;
		}

		for (let i of items) {
			console.log(i.price);
			if (i.name == "") {
				setReceiptError("Please enter a valid name for all items.");
				return;
			} else if (
				isNaN(i.price) ||
				isNaN(i.quantity) ||
				i.price <= 0 ||
				i.quantity < 1
			) {
				setReceiptError(
					`Please enter a valid price and quantity for ${i.name}`
				);
				return;
			} else if (i.category == "") {
				setReceiptError(`Please enter a valid category for ${i.name}`);
				return;
			}
		}

		console.log(date);

		const payload = {
			"shopper-username": shopper.username,
			"shopper-uuid": shopper.uuid,
			receipt: {
				date: date,
				store: {
					"store-uuid": storeUUID,
				},
				items: items,
			},
		};

		console.log(payload); //debugging (remove later)

		instance
			.post("submit-receipt", payload)
			.then((response) => {
				console.log("Receipt-uuid: " + response.data["receipt-uuid"]);
				setReceiptError("Receipt submitted sucessfully!");
				setItems([]);
			})
			.catch((error) => {
				console.log(error);
				console.log(
					`Received code ${error.status} with error: ${error.response.data.message}`
				);
			});
	};

	return (
		<div className="receipt-page">
			<div className="receipt-main">
				<h2>Receipts</h2>
				{receiptError != "" ? <p>{receiptError}</p> : <></>}
				<label>Date: <input
					className="date-picker"
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/></label>
				<label>Store: &nbsp;
				<select
					className="store-picker"
					name="Store"
					onChange={(e) => {
						setStoreUUID(e.target.value);
					}}
				>
					<option key={"choose-store"} value="choose-store">
						Choose store
					</option>
					{chains
						.map((chain: ListedChain) => {
							return chain.stores.map((store: ListedStore) => {
								return (
									<option
										key={store["store-uuid"]}
										value={store["store-uuid"]}
									>
										{chain.name} - {store.address}
									</option>
								);
							});
						})
						.flat()}
				</select></label>

				<div className="receipt-items">
					{items.map((el) => {
						return (
							<ReceiptItem
								key={el.localID}
								item={el}
								removeItem={removeItem}
							/>
						);
					})}
					<div className="buttons-container">
						<button
							className="add-item-button"
							onClick={() => {
								setItems([...items, new Item("", 0, 1, "")]);
							}}
						>
							Add Item
						</button>
						<button
							className="add-item-button" /*im using the same css*/
							onClick={() => {
								submitReceipt();
							}}
						>
							Submit Receipt
						</button>
						<button
							className="ai-button"
							onClick={() => {
								setAnalyzingReceipt(true);
							}}
						>
							Analyze with AI
						</button>
					</div>
					{analyzingReceipt ? (
						<AnalyzeModal
							onParsed={loadReceipt}
							onClose={() => setAnalyzingReceipt(false)}
						/>
					) : null}
				</div>
				</div>

			<div className="store-panel">
				<AddStores chains={chains} fetchChains={fetchChains} />
			</div>
		</div>
	);
}
