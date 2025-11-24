import React, { useState, useEffect } from "react";
type Item = {
	"item-uuid": string,
	"name": string,
	"quantity": number
};
export default function ReceiptItem({
	item,
	shoppingListUUID,
	shoppingListName,
	modifyItem,
	removeItem
} : {
	item: Item,
	shoppingListUUID: string,
	shoppingListName: string,
	modifyItem: (item: Item, shoppingListUUID: string, shoppingListName: string) => void,
	removeItem: (item: Item, shoppingListUUID: string, shoppingListName: string) => void
}) {
	// local editable state so the inputs remain editable while typing
	const [name, setName] = useState(item.name);
	const [quantityStr, setQuantityStr] = useState(String(item.quantity));
	const [editingName, setEditingName] = useState(false);
	const [editingQuantity, setEditingQuantity] = useState(false);
	// keep local state in sync when parent item changes
	useEffect(() => {
		setName(item.name);
		setQuantityStr(String(item.quantity));
	}, [item]);

	return (
		<div>
			{
				editingName ? (
					<div>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<button onClick={() => {
							// only commit if changed
							if (name !== item.name) {
								modifyItem({
									...item,
									name: name
								}, shoppingListUUID, shoppingListName)
							}
							setEditingName(false);
						}}>Save</button>
						<button onClick={() => {
							setName(item.name); // revert changes
							setEditingName(false);
						}}>Cancel</button>
					</div>
				) : <div onClick={() => setEditingName(true)}>
					{name}&#x270E;
					</div>
			}
			<div>
				{editingQuantity ? (
				<div>
					<input
						type="number"
						value={quantityStr}
						onChange={(e) => setQuantityStr(e.target.value)}
					/>
					<button onClick={() => {
						const quantity = parseInt(quantityStr) || 0;
						if (quantity >= 0 && quantity !== item.quantity) {
							modifyItem({
								...item,
								quantity: quantity
							}, shoppingListUUID, shoppingListName)
						}
						setEditingQuantity(false);
					}}>Save</button>
					<button onClick={() => {
						setQuantityStr(String(item.quantity)); // revert changes
						setEditingQuantity(false);
					}}>Cancel</button>
				</div>
				) : <span onClick={() => setEditingQuantity(true)}>
					Quantity: {item.quantity}&#x270E;
				</span>}
			</div>
			<button onClick={() => { removeItem(item, shoppingListUUID, shoppingListName) }}>&#x1F5D1;</button>
		</div>
	)
}

