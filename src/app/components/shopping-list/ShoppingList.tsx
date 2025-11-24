"use client";
import { useState } from 'react';
import ShoppingListItem from './ShoppingListItem';
type Item = {
	"item-uuid": string,
	name: string,
	quantity: number
};
type ShoppingList = {
	"shopping-list-uuid": string,
	"name": string,
	items: Item[]
};
export default function ShoppingList({
	list,
	modifyItem,
	removeItem,
	addItem,
	deleteList,
	modifyListName,
	editing,
	setEditing
}: {
	list: ShoppingList,
	modifyItem: (item: Item, shoppingListUUID: string, shoppingListName: string) => void,
	removeItem: (item: Item, shoppingListUUID: string, shoppingListName: string) => void,
	addItem: (shoppingListUUID: string, shoppingListName: string) => void,
	deleteList: (shoppingListUUID: string, shoppingListName: string) => void,
	modifyListName: (shoppingListUUID: string, newName: string) => void,
	editing: boolean,
	setEditing: (editing: boolean) => void
}) {
	const [editingName, setEditingName] = useState(false);
	const [newName, setNewName] = useState(list["name"]);

	return (
		<div>
			<h3>
				{
					editingName ? (
						<span>
							<input
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
							/>
							<button onClick={() => {
								modifyListName(list["shopping-list-uuid"], newName);
								setEditingName(false);
								setEditing(false);
							}}>Save</button>
							<button onClick={() => {
								setNewName(list["name"]);
								setEditingName(false);
								setEditing(false);
							}}>Cancel</button>
						</span>
					) : (
						<span onClick={() => {if (!editing) {setEditingName(true); setEditing(true);}}}>
							{list["name"]}{!editing ? (<>&#x270E;</>) : ""}
						</span>
					)
				}
			</h3>
			<div>
				<ul>
					{list.items.map((item: Item) => (
						<ShoppingListItem
							key={item["item-uuid"]}
							item={item}
							shoppingListUUID={list["shopping-list-uuid"]}
							shoppingListName={list["name"]}
							modifyItem={modifyItem}
							removeItem={removeItem}
							editing={editing}
							setEditing={setEditing}
						/>
					))}
				</ul>
				<button onClick={
					() => addItem(list["shopping-list-uuid"], list["name"])}>
						Add Item
				</button>
				<button onClick={
					() => deleteList(list["shopping-list-uuid"], list["name"])}>
						Delete List
				</button>
			</div>
		</div>
	);

}
