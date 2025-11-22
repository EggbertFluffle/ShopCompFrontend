import { useState } from "react";
import Item from "../lib/Item";

export default function ReceiptItem({ item, removeItem }: { item: Item, removeItem: (uuid: string) => void }) {
	const [name, setName] = useState("[item name]");
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [category, setCatergory] = useState("[item category]");

	function changeName(_name: string) {
		setName(_name);
		item.name = _name;
	}

	function changePrice(_price: number) {
		setPrice(_price);
		item.price = _price;
	}

	function changeQuantity(_quantity: number) {
		_quantity = _quantity < 1 ? 1 : _quantity;
		setQuantity(_quantity);
		item.quantity = _quantity;
	}

	function changeCategory(_category: string) {
		setCatergory(_category);
		item.category = _category;
	}

	return (
		<div>
			<div>
				<label>Item name:</label>
				<input
					value={name}
					onChange={(e) => {
						changeName(e.target.value);
					}}
				/>
			</div>

			<div>
				<label>Price:</label>
				<input
					value={price}
					onChange={(e) => {
						changePrice(e.target.valueAsNumber);
					}}
				/>
			</div>

			<div>
				<label>Quantity:</label>
				<div>
					<input
						value={quantity}
						type="number"
						onChange={(e) => {
							setQuantity(e.target.valueAsNumber);
						}}
					/>
				</div>
			</div>

			<label>Category:</label>
			<input
				onChange={(e) => {
					changeCategory(e.target.value);
				}}
			/>
			<button
				onClick={() => {
					removeItem(item.uuid);
				}}
			>
				
			</button>
		</div>
	);
}
