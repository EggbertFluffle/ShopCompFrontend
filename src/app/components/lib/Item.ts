import { v4 as getUUIDv4 } from "uuid";

export default class Item {
	name: string;
	price: number;
	quantity: number;
	uuid: string;

	constructor(name: string, price: number, quantity: number, uuid: string = getUUIDv4()) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.uuid = uuid;
	}
}
