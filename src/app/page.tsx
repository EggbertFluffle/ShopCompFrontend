'use client';
import { useState } from 'react';
import { ViewState } from './components/lib/types';

import LoginShopper from './components/login-shopper/LoginShopper';
import ShoppingLists from './components/shopping-list/ShoppingLists';
import Receipt from './components/receipt/Receipt';
import RegisterShopper from './components/register-shopper/RegisterShopper';
import ShopperDashboard from './components/shopper-dashboard/ShopperDashboard';
import AdminDashboard from './components/admin-dashboard/AdminDashboard';

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
			case "shopping-list":
				return <ShoppingLists />;
			case "shopper-dashboard":
				return <ShopperDashboard />;
			case "admin-dashboard":
				return <AdminDashboard />;
			default:
				return <div>Invalid State</div>;
		}
	};

	return (
		<>
			<select
				onChange={(e) => setState(e.target.value as ViewState)}
				value={state}
			>
				<option value="register-shopper">Register Shopper</option>
				<option value="login-shopper">Login Shopper</option>
				<option value="shopping-list">Shopping List</option>
				<option value="receipt">Receipt</option>
				<option value="shopper-dashboard">Shopper Dashboard</option>
				<option value="admin-dashboard">Admin Dashboard</option>
			</select>
			{displayComponent(state)}
		</>
	);
}
