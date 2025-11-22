export default class Item {
	name: string;
	price: number;
	quantity: number;
	category: string;
	uuid: string;

	constructor(name: string, price: number, quantity: number, category: string) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.category = category;
		this.uuid = ""; //CHANGE
	}
}
