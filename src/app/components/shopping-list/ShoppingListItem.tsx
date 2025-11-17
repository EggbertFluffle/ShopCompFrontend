import { useState } from "react";
import Item from "../lib/Item";

export default function ReceiptItem({ item, removeItem } : { item: Item, removeItem: (uuid: string ) => void }) {
	const [ name, setName ] = useState("[item name]");
	const [ price, setPrice ] = useState(0);
	const [ quantity, setQuantity ] = useState(0);

	function changeName(_name: string) {
		setName(_name);
		item.name = name;
	}

	function changeQuantity(_quantity: number) {
		setQuantity(_quantity);
		item.quantity = quantity;
	}

	return (
		<div>
			<input value={name} onChange={(e) => { changeName(e.target.value) }} />
			<div>
				<button onClick={() => { if(quantity > 0) changeQuantity(quantity - 1) }}>-</button>
				<input value={quantity} onChange={(e) => { setQuantity(e.target.valueAsNumber) }} />
				<button onClick={() => { changeQuantity(quantity + 1) }}>-</button>
			</div>
			<button onClick={() => { removeItem(item.uuid) }}></button>
		</div>
	)
}
