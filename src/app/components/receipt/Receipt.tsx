import { useRef, useState, useEffect } from "react";
import Item from "../lib/Item";
import ReceiptItem from "./ReceiptItem";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Receipt() {
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]); //GPT

	const [stores, setStores] = useState([]);
	const [storeUUID, setStoreUUID] = useState("");
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => { // I added it again because of the render infinite loop
		instance
			.get("get-store-chains")
			.then((response) => {
				const chains = response.data.chains;

				let newStores = [];

				for (let chain of chains) {
					for (let store of chain.stores) {
						newStores.push({
							"chain-name": chain.name,
							address: store.address,
							"store-uuid": store["store-uuid"],
							// label: `${chain.name} (${s.address})`, //label for dropdown
							// "store-uuid": s["store-uuid"], //not in the drop down but used to submit right UUIDs
							// address: s.address,
						});
					}
				}

				setStores(newStores);
			})
			.catch((err) => console.error(err));
	}, []);

	function removeItem(uuid: string) {
		setItems(items.filter((i) => i.uuid != uuid));
	}

	const submitReceipt = () => {
		console.log(storeUUID);
		const payload = {
			"shopper-uuid": shopper.uuid,
			receipt: {
				date: date,
				store: {
					"store-uuid": storeUUID,
				},
				items: items,
			},
		};

		console.log("PAYLOAD:", JSON.stringify(payload, null, 2)); //debugging (remove later)

		instance.post("submit-receipt", payload)
			.then((response) => {
				console.log("Receipt-uuid: " + response.data["receipt-uuid"]);
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
			<input onChange={(e) => setDate(e.target.value)} type="date" />
			<select
				name="Store"
				onChange={(e) => {
					setStoreUUID(e.target.value);
				}}
			>
				{stores.map((store) => {
					return (
						<option
							key={store["store-uuid"]}
							value={store["store-uuid"]}
						>
							{store["chain-name"]} | {store.address}
						</option>
					);
				})}
			</select>
			<div>
				{items.map((el) => {
					return (
						<ReceiptItem
							key={el.uuid}
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
						new Item("[item name]", 0, 0, "[item category]"),
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
