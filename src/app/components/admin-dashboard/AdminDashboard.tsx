"use client";
import "./page.css";

import { useState, useEffect } from "react";
import { ViewState } from "./components/lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

type ListedStore = {
	address: string;
	"store-uuid": string;
}

type ListedChain = {
	"name": string;
	"url": string;
	"chain-uuid": string;
	stores: ListedStore[]
};

export default function AdminDashboard() {
    const [salesList, setSalesList] = useState([]);
	const [chains, setChains] = useState<ListedChain[]>([]);

    const reportStoreChainSales = (shopperUUID: string) => {
        return instance
			.post("report-store-chain-sales", {
				"admin-uuid": shopperUUID,
			})
			.then((response) => {
				const data = JSON.parse(response.data.body);
				const sales = data["sales-list"];
				return sales;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
    }

	const fetchChains = () => {
		instance
			.get("get-store-chains")
			.then((response) => {
				const chains = response.data.chains;

				let new_chains: ListedChain[] = [];

				console.log(response);

				for (let chain of chains) {
					new_chains.push({
						name: chain.name,
						url: chain.url,
						"chain-uuid": chain["store-chain-uuid"],
						stores: []
					} as ListedChain);
					for (let store of chain.stores) {
						new_chains[new_chains.length - 1].stores.push({
							address: store.address as string,
							"store-uuid": store["store-uuid"] as string,
						} as ListedStore);
					}
				}

				setChains(new_chains);
			})
			.catch((err) => console.error(err));
	}

	const removeStore = (storeUUID: string) => {
		const payload = {
			"admin-uuid": shopper.uuid,
			"store-uuid": storeUUID
		};

		instance.post("remove-store", payload)
			.then(() => { fetchChains(); })
			.catch((e) => {
				console.error("Unable to remove a store");
				console.error(e);
			})
	}

	const removeChain= (chainUUID: string) => {
		const payload = {
			"admin-uuid": shopper.uuid,
			"store-uuid": chainUUID
		};

		instance.post("remove-chain", payload)
			.then(() => { fetchChains(); })
			.catch((e) => {
				console.error("Unable to remove a store");
				console.error(e);
			})
	}

    useEffect(() => {
		reportStoreChainSales(shopper.uuid).then((sales) => {
			setSalesList(sales);
		});
		fetchChains();
	}, []);

    return (
        <div>
			<h2>Admin Dashboard</h2>
            <label>Store Chain Sales</label>
            <div>
				{salesList.map((item: any, index: number) => (
					<p key={index}>
						{item["chain-name"]}: ${item["total-sales"]}
					</p>
				))}
			</div>
			<div className="store-chains-container">
				<h2>Store Chains</h2>
				<div className="store-chains">
					{chains.map((chain: ListedChain) => {
						return <div className="store-chain">
							<h3>{chain.name}</h3>
							<h4><a href={chain.url}>{chain.url}</a></h4>
							<ul className="chain-stores">
								{chain.stores.map((store: ListedStore) => {
									return <li className="store-chain-store">{store.address} |
										<button className="remove-store-button" onClick={(e) => {
											removeStore(store["store-uuid"]);
										}}>remove
										</button>
									</li>
								})}
							</ul>
							<button onChange={(e) => {
								removeChain(chain["chain-uuid"]);
							}}>Remove Chain</button>
						</div>
					})}
				</div>
			</div>
        </div>
    );
}
