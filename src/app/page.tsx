'use client';
import { useState } from 'react';
import { ViewState } from './components/lib/types';

import ShoppingList from './components/shopping-list/ShoppingList';
import Receipt from './components/receipt/Receipt';
import RegisterShopper from './components/register-shopper/RegisterShopper';

export default function Home() {
	const [state, setState] = useState<ViewState>("register-shopper");

	const displayComponent = (state: ViewState ) => {
		switch (state) {
			case "register-shopper":
				return <>
					<RegisterShopper setState={setState} />
					<Receipt />
				</>;
			case "shopping-list":
				return <ShoppingList />;
			case "receipt":
				return <Receipt />;
			default:
				return <div>Invalid State</div>;
		}
	};

	return (
		<>
		{// will remove this later, just here for testing}
		<select value={state} onChange={(e) => { setState(e.target.value as ViewState) }}>
			<option value="register-shopper">Register Shopper</option>
			<option value="shopping-list">Shopping List</option>
			<option value="receipt">Receipt</option>
		</select>
		}
		{displayComponent(state)}</>
	);
}
