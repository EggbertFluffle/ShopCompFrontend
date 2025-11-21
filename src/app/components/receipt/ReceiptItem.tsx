import { useState } from "react";
import Item from "../lib/Item";

export default function ReceiptItem({ item, removeItem } : { item: Item, removeItem: (uuid: string ) => void }) {
	const [ name, setName ] = useState("[item name]");
	const [ price, setPrice ] = useState(0);
	const [ quantity, setQuantity ] = useState(0);
	const [ category, setCatergory] = useState("Produce");

	function changeName(_name: string) {
		setName(_name);
		item.name = name;
	}

	function changePrice(_price: number) {
		item.price = 10;
		setPrice(_price);
		// item.price = price;
	}

	function changeQuantity(_quantity: number) {
		setQuantity(_quantity);
		item.quantity = quantity;
	}

	function changeCategory(_category: string) {
		setCatergory(_category);
		item.category = category;
	}

	return (
		<div>
			<div>
				<label>Item name:</label>
				<input value={name} onChange={(e) => { changeName(e.target.value) }} />
			</div>

			<div>
				<label>Price:</label>
				<input onChange={(e) => { changePrice(e.target.valueAsNumber) }} />
			</div>

			<div>
				<label>Quantity:</label>
				<div>
					<input type="number" onChange={(e) => { setQuantity(e.target.valueAsNumber) }} />
				</div>
			</div>

			<label>Category:</label>
			<input onChange={(e) => { changeCategory(e.target.value) }} />
			<button onClick={() => { removeItem(item.uuid) }}></button>
		</div>
	)
}
