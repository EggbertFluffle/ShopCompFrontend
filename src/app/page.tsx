'use client';
import { useState } from 'react';
import { ViewState } from './components/lib/types';

import { AuthProvider } from 'react-oidc-context';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_N6LnWf6ym",
  client_id: "5m9to35nji6n1ibma2j96904r9",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email",
};

import LoginShopper from './components/login-shopper/LoginShopper';
import ShoppingLists from './components/shopping-list/ShoppingLists';
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
			case "shopping-list":
				return <ShoppingLists />;
			default:
				return <div>Invalid State</div>;
		}
	};

	return (
		<AuthProvider {...cognitoAuthConfig}>
			<select onChange={(e) => setState(e.target.value as ViewState)} value={state}>
				<option value="register-shopper">Register Shopper</option>
				<option value="login-shopper">Login Shopper</option>
				<option value="shopping-list">Shopping List</option>
				<option value="receipt">Receipt</option>
			</select>
			{displayComponent(state)}
		</AuthProvider>
	);
}
