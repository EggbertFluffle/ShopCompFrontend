import "./page.css";

import { useState } from "react";
import Item from "../lib/Item";

export default function ReceiptItem({
	item,
	removeItem,
}: {
	item: Item;
	removeItem: (uuid: string) => void;
}) {
	const [name, setName] = useState(item.name ?? "");
	const [price, setPrice] = useState(item.price ?? "");
	const [quantity, setQuantity] = useState(item.quantity ?? "1");
	const [category, setCatergory] = useState(item.category ?? "");

	return (
		<div className="item">
			<div className="item-field">
				<label>Item name:</label>
				<input
					className="item-input"
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						item.name = e.target.value;
					}}
				/>
			</div>

			<div className="item-field">
				<label>Price:</label>
				<input
					className="item-input"
					value={price}
					onChange={(e) => {
						setPrice(e.target.value);
						item.price = parseFloat(e.target.value);
					}}
				/>
			</div>

			<div className="item-field">
				<label>Quantity:</label>
				<input
					className="item-input"
					value={quantity}
					onChange={(e) => {
						setQuantity(e.target.value);
						item.quantity = parseInt(e.target.value);
					}}
				/>
			</div>

			<div className="item-field">
				<label>Category:</label>
				<input
					className="item-input"
					value={category}
					onChange={(e) => {
						setCatergory(e.target.value);
						item.category = e.target.value;
					}}
				/>
			</div>
			<button
				className="remove-button"
				onClick={() => {
					removeItem(item.localID);
				}}
			>
				Remove
			</button>
		</div>
	);
}
