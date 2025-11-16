import { useRef, useState } from "react";
import Item from "../lib/Item";
import ShoppingListItem from "./ShoppingListItem";

export default function Receipt() {
	const date = useRef<Date>(new Date());
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

	return (
		<div>
			<p>Date: {date.current.getMonth()}/{date.current.getDay()}/{date.current.getFullYear()}</p>
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
						return <ShoppingListItem key={el.uuid} item={el} removeItem={removeItem} />
					})
				}
			</div>
			<button onClick={() => { setItems([...items, new Item("[item name]", 0, 0)]) }}>Add Item</button>
		</div>
	);
}
