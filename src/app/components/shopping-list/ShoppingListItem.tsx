import "./page.css";

import React, { useState, useEffect } from "react";
type Item = {
	"item-uuid": string;
	name: string;
	quantity: number;
};
export default function ReceiptItem({
	item,
	shoppingListUUID,
	shoppingListName,
	modifyItem,
	removeItem,
	editing,
	setEditing,
}: {
	item: Item;
	shoppingListUUID: string;
	shoppingListName: string;
	modifyItem: (
		item: Item,
		shoppingListUUID: string,
		shoppingListName: string
	) => void;
	removeItem: (
		item: Item,
		shoppingListUUID: string,
		shoppingListName: string
	) => void;
	editing: boolean;
	setEditing: (editing: boolean) => void;
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
		<div className="single-item">
			{editingName ? (
				<div>
					<input
						className="shopping-list-name-input"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button
						className="shopping-list-item-action-button"
						onClick={() => {
							// only commit if changed
							if (name !== item.name) {
								modifyItem(
									{
										...item,
										name: name,
									},
									shoppingListUUID,
									shoppingListName
								);
							}
							setEditingName(false);
							setEditing(false);
						}}
					>
						Save
					</button>
					<button
						className="shopping-list-item-action-button"
						onClick={() => {
							setName(item.name); // revert changes
							setEditingName(false);
							setEditing(false);
						}}
					>
						Cancel
					</button>
				</div>
			) : (
				<div
					onClick={() => {
						if (!editing) {
							setEditingName(true);
							setEditing(true);
						}
					}}
				>
					{name}&nbsp;&nbsp;
					{!editing ? (
						<button className="edit-button">Edit</button>
					) : (
						""
					)}
				</div>
			)}
			<div>
				{editingQuantity ? (
					<div>
						<input
							className="shopping-list-name-input"
							type="number"
							value={quantityStr}
							onChange={(e) => setQuantityStr(e.target.value)}
						/>
						<button
							className="shopping-list-item-action-button"
							onClick={() => {
								const quantity = parseInt(quantityStr) || 0;
								if (
									quantity >= 0 &&
									quantity !== item.quantity
								) {
									modifyItem(
										{
											...item,
											quantity: quantity,
										},
										shoppingListUUID,
										shoppingListName
									);
								}
								setEditingQuantity(false);
								setEditing(false);
							}}
						>
							Save
						</button>
						<button
							className="shopping-list-item-action-button"
							onClick={() => {
								setQuantityStr(String(item.quantity)); // revert changes
								setEditingQuantity(false);
								setEditing(false);
							}}
						>
							Cancel
						</button>
					</div>
				) : (
					<span
						onClick={() => {
							if (!editing) setEditingQuantity(true);
							setEditing(true);
						}}
					>
						Quantity: {item.quantity}&nbsp;&nbsp;
						{!editing ? (
							<button className="edit-button">Edit</button>
						) : (
							""
						)}
					</span>
				)}
			</div>
			<button
				onClick={() => {
					if (editing && (editingName || editingQuantity)) {
						setEditing(false);
					}
					removeItem(item, shoppingListUUID, shoppingListName);
				}}
			>
				Remove
			</button>
		</div>
	);
}
