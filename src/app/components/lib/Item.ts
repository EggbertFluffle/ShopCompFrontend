import { v4 as uuidv4 } from "uuid"; //local IDs ONLY (not using this for item-uuid)

export default class Item {
	name: string;
	price: number;
	quantity: number;
	category: string;
	uuid: string;
	localID: number;

	constructor(
		name: string,
		price: number,
		quantity: number,
		category: string
	) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.category = category;
		this.uuid = "";
		this.localID = uuidv4(); //local ID
	}
}
