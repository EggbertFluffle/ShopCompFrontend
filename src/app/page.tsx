'use client';
import { useState } from 'react';
import { ViewState } from './components/lib/types';

import LoginShopper from './components/login-shopper/LoginShopper';
import ShoppingList from './components/shopping-list/ShoppingList';
import Receipt from './components/receipt/Receipt';
import RegisterShopper from './components/register-shopper/RegisterShopper';

export default function Home() {
	const [state, setState] = useState<ViewState>("register-shopper");

	const displayComponent = (state: ViewState ) => {
		switch (state) {
			case "register-shopper":
				return <RegisterShopper setState={setState} />;
			case "receipt":
				return <Receipt />;
			case "login-shopper":
				return <LoginShopper setState={setState} />;
			default:
				return <div>Invalid State</div>;
		}
	};

	return (
		<>
			<select onChange={(e) => setState(e.target.value as ViewState)} value={state}>
				<option value="register-shopper">Register Shopper</option>
				<option value="login-shopper">Login Shopper</option>
				<option value="receipt">Receipt</option>
			</select>
			{displayComponent(state)}
		</>
	);
}
