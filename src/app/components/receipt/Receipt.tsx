import { useRef, useState } from "react";
import Item from "../lib/Item";
import ReceiptItem from "./ReceiptItem";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Receipt() {
	const [ date, setDate ] = useState(Date.now().toString());
	const [ store, setStore ] = useState({
		"address": "25 Tobias Boland Way, Worcester, MA 01607",
		"store-uuid": "d692e282-84d6-45f6-8959-15a07565f53d"
	});
	const [ items, setItems ] = useState<Item[]>([]);

	function removeItem(uuid: string) {
		setItems(items.filter((i) => i.uuid != uuid));
	}

	const stores: string[] = [
		"BJ's",
		"Wawa",
		"Tech Pizza",
		"Chik-n-bap"
	];

	const submitReceipt = () => {
		console.log(date);

		const payload = {
			"shopper-username": shopper.username,
			"shopper-uuid": shopper.uuid,
			"receipt": {
				"date": date,
				"store": store,
				"items": items
			}
		};

		instance.post("submit-receipt", payload)
			.then((response) => {
				console.log("Receipt-uuid: " + response.data["receipt-uuid"]);
			})
			.catch((error) => {
				console.log(error);
				console.log(`Received code ${error.status} with error: ${error.response.data.message}`);
			});
	}

	return (
		<div>
			<input onChange={(e) => setDate(e.target.value)} type="date" />
			<select name="Store">
				{
					stores.map((store) => {
						return <option key={store.toLowerCase()} value={store.toLowerCase()}>{store}</option>
					})
				}
			</select>
			<div>
				{
					items.map((el) => {
						return <ReceiptItem key={el.uuid} item={el} removeItem={removeItem} />
					})
				}
			</div>
			<button onClick={() => { setItems([...items, new Item("[item name]", 0, 0, "[item category]")]) }}>Add Item</button>
			<button onClick={() => { submitReceipt() }}>Submit Receipt</button>
		</div>
	);
}
