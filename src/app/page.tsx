'use client';
import { useState } from 'react';
import { ViewState } from './components/lib/types';

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
			default:
				return <div>Invalid State</div>;
		}
	};

	return (
		<>{displayComponent(state)}</>
	);
}
