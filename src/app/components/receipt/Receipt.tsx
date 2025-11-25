import { useRef, useState, useEffect } from "react";
import Item from "../lib/Item";
import ReceiptItem from "./ReceiptItem";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

type ListedStore = { "chain-name": string, "address": string, "store-uuid": string };

export default function Receipt() {
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]); //GPT
	const [stores, setStores] = useState<ListedStore[]>([]);
	const [storeUUID, setStoreUUID] = useState("");
	const [items, setItems] = useState<Item[]>([]);
	const [receiptError, setReceiptError] = useState("");

	useEffect(() => { // I added it again because of the render infinite loop
		instance
			.get("get-store-chains")
			.then((response) => {
				const chains = response.data.chains;

				let newStores: { "chain-name": string, "address": string, "store-uuid": string }[] = [];

				for (let chain of chains) {
					for (let store of chain.stores) {
						newStores.push({
							"chain-name": chain.name as string,
							"address": store.address as string,
							"store-uuid": store["store-uuid"] as string,
						} as ListedStore);
					}
				}

				setStores(newStores);
			})
			.catch((err) => console.error(err));
	}, []);

	// function removeItem(uuid: string) {
	// 	setItems(items.filter((i) => i.uuid != uuid));
	// }

	function removeItem(localID: string) {
		setItems(items.filter((i) => i.localID !== localID));
	}

	const submitReceipt = () => {
		if(storeUUID == "choose-store" || storeUUID == "") {
			setReceiptError("Please choose a store before submitting a receipt.");
			return;
		}

		if(items.length < 1) {
			setReceiptError("Please add at lease one item to the receipt.");
			return;
		}


		for(let i of items) {
			console.log(i.price);
			if(i.name == "") {
				setReceiptError("Please enter a valid name for all items.");
				return;
			} else if(isNaN(i.price) || isNaN(i.quantity) || i.price <= 0 || i.quantity < 1) {
				setReceiptError(`Please enter a valid price and quantity for ${i.name}`);
				return;
			} else if(i.category == "") {
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

		instance.post("submit-receipt", payload)
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
		<div>
			{receiptError != "" ? <p>{receiptError}</p> : <></>}
			<input onChange={(e) => setDate(e.target.value)} type="date" />
			<select name="Store" onChange={(e) => { setStoreUUID(e.target.value); }} >
				<option key={"choose-store"} value="choose-store" >Choose store</option>
				{stores.map((store: ListedStore) => {
					return (
						<option key={store["store-uuid"]} value={store["store-uuid"]} >
							{store["chain-name"]} | {store.address}
						</option>
					)
				})}
			</select>
			<div>
				{items.map((el) => {
					return (
						<ReceiptItem
							key={el.localID}
							item={el}
							removeItem={removeItem}
						/>
					);
				})}
			</div>
			<button
				onClick={() => {
					setItems([
						...items,
						new Item("", 0, 1, ""),
					]);
				}}
			>
				Add Item
			</button>
			<button
				onClick={() => {
					submitReceipt();
				}}
			>
				Submit Receipt
			</button>
		</div>
	);
}
