'use client';
import { useState } from 'react';
import { ViewState } from './components/lib/types';

import LoginShopper from './components/login-shopper/LoginShopper';
import ShoppingLists from './components/shopping-list/ShoppingLists';
import Receipt from './components/receipt/Receipt';
import RegisterShopper from './components/register-shopper/RegisterShopper';
import ShopperDashboard from './components/shopper-dashboard/ShopperDashboard';
import AdminDashboard from './components/admin-dashboard/AdminDashboard';

import "./page.css";

export default function Home() {
	const [state, setState] = useState<ViewState>("login-shopper");

	const getState = () => {
		return state;
	}

	const displayComponent = (state: ViewState ) => {
		switch (state) {
			case "register-shopper":
				return <RegisterShopper setState={setState} />;
			case "login-shopper":
				return <LoginShopper setState={setState} />;
			case "receipt":
				return <Receipt />;
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
			{(state == "login-shopper" || state == "register-shopper") ?
				<></> :
				<nav className="nav">
					<button
						className={state == "receipt" ? "selected" : ""}
						onClick={() => {
							setState("receipt");
						}}>Receipts</button>

					<button
						className={state == "shopping-list" ? "selected" : ""}
						onClick={() => {
							setState("shopping-list");
						}}>Shopping Lists</button>

					<button
						className={state == "shopper-dashboard" ? "selected" : ""}
						onClick={() => {
							setState("shopper-dashboard");
						}}>Dashboard</button>
				</nav>
			}
			{displayComponent(state)}
		</>
	);
}
