import { useEffect, useRef, useState } from "react";
import ShoppingList from "./ShoppingList";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";
type Item = {
	"item-uuid": string,
	"name": string,
	"quantity": number
};

export default function ShoppingLists() {
	const [lists, setLists] = useState<any[]>([]);
	useEffect(() => {
		instance.post("list-shopping-lists", {
			"shopper-uuid": shopper.uuid
		}).then((response) => {
			console.log(response);
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	}, []);
	const modifyItem = async (item: Item, shoppingListUUID: string, shoppingListName: string) => {
		setLists((prevLists) => {
			// optimistic update
			return prevLists.map((list) => {
				if (list["shopping-list-uuid"] === shoppingListUUID) {
					return {
						...list,
						items: list.items.map((it: Item) => {
							if (it["item-uuid"] === item["item-uuid"]) {
								return item;
							}
							return it;
						})
					};
				}
				return list;
			});
		});
		instance.post("modify-on-shopping-list", {
			"shopper-uuid": shopper.uuid,
			"shopper-username": shopper.username,
			"item-uuid": item["item-uuid"],
			"item-name": item.name,
			"item-quantity": item.quantity,
			"shopping-list-uuid": shoppingListUUID,
			"shopping-list-name": shoppingListName
		}).then((response) => {
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	};
	const removeItem = async (item: Item, shoppingListUUID: string, shoppingListName: string) => {
		instance.post("remove-from-shopping-list", {
			"shopper-uuid": shopper.uuid,
			"shopper-username": shopper.username,
			"item-name": item.name,
			"item-uuid": item["item-uuid"],
			"shopping-list-uuid": shoppingListUUID,
			"shopping-list-name": shoppingListName
		}).then((response) => {
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	}
	const addItem = (shoppingListUUID: string, shoppingListName: string) => {
		instance.post("add-to-shopping-list", {
			"shopper-uuid": shopper.uuid,
			"shopper-username": shopper.username,
			"item-name": "New Item",
			"item-quantity": 0,
			"shopping-list-uuid": shoppingListUUID,
			"shopping-list-name": shoppingListName
		}).then((response) => {
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	};
	const createNewList = () => {
		instance.post("create-shopping-list", {
			"shopper-uuid": shopper.uuid,
			"shopper-username": shopper.username,
			"shopping-list-name": "New List"
		}).then((response) => {
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	};
	const deleteList = (shoppingListUUID: string, shoppingListName: string) => {
		instance.post("remove-shopping-list", {
			"shopper-uuid": shopper.uuid,
			"shopper-username": shopper.username,
			"shopping-list-uuid": shoppingListUUID,
			"shopping-list-name": shoppingListName
		}).then((response) => {
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	};
	const modifyListName = (shoppingListUUID: string, newName: string) => {
		setLists((prevLists) => {
			// optimistic update
			return prevLists.map((list) => {
				if (list["shopping-list-uuid"] === shoppingListUUID) {
					return {
						...list,
						"name": newName
					};
				}
				return list;
			});
		});
		instance.post("modify-shopping-list", {
			"shopper-uuid": shopper.uuid,
			"shopper-username": shopper.username,
			"shopping-list-uuid": shoppingListUUID,
			"shopping-list-name": newName
		}).then((response) => {
			setLists(response["data"]["shopping-list"]);
		}).catch((err) => {
			console.error(err);
		});
	};
	return (
		<div>
		{ shopper.uuid ? lists && <>
			{lists.map((list) => (
				<ShoppingList
					key={list["shopping-list-uuid"]}
					list={list}
					modifyItem={modifyItem}
					removeItem={removeItem}
					addItem={addItem}
					deleteList={deleteList}
					modifyListName={modifyListName}
				/>
			))}
			<button onClick={() => {
				createNewList();
			}}>Create New Shopping List</button>
		</>
		: <p>Please log in to view your shopping lists.</p>
		}
		</div>
	);
}
