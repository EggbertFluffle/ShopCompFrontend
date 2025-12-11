"use client";
import "./page.css";

import { useState, useEffect } from "react";
import { ViewState } from "./components/lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function AdminDashboard() {
    const [salesList, setSalesList] = useState([]);

    function reportStoreChainSales(shopperUUID: string) {
        return instance
			.post("report-store-chain-sales", {
				"admin-uuid": shopperUUID,
			})
			.then((response) => {
				const salesData = response.data["sales-list"];
				console.log(salesData);
				return salesData;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
    }

    useEffect(() => {
		reportStoreChainSales(shopper.uuid).then((salesData) => {
			setSalesList(salesData);
		});
	}, []);

    return (
		<div>
			<h2>Admin Dashboard</h2>
			<label>Store Chain Sales</label>
			<div>
				{salesList.map((item: any, index: number) => (
					<p key={index}>
						{item["chain-name"]}: $
						{Number(item["total-sales"]).toFixed(2)}
					</p>
				))}
			</div>
		</div>
	);
}
