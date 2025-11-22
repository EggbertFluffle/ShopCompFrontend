import { useState } from "react";
import Item from "../lib/Item";

export default function ReceiptItem({ item, removeItem }: { item: Item, removeItem: (uuid: string) => void }) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [quantity, setQuantity] = useState("1");
	const [category, setCatergory] = useState("");

	return (
		<div>
			<div>
				<label>Item name:</label>
				<input
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						item.name = e.target.value;
					}}
				/>
			</div>

			<div>
				<label>Price:</label>
				<input
					value={price}
					onChange={(e) => {
						setPrice(e.target.value);
						item.price = parseInt(e.target.value);
					}}
				/>
			</div>

			<div>
				<label>Quantity:</label>
				<div>
					<input
						value={quantity}
						onChange={(e) => {
							setQuantity(e.target.value);
							item.quantity = parseInt(e.target.value);
						}}
					/>
				</div>
			</div>

			<label>Category:</label>
			<input
				onChange={(e) => {
					setCatergory(e.target.value);
					item.category = e.target.value;
				}}
			/>
			<button
				onClick={() => {
					removeItem(item.uuid);
				}}
			>
				Remove
			</button>
		</div>
	);
}
