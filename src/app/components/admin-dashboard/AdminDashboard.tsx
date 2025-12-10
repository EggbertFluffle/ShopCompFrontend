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
				const data = JSON.parse(response.data.body);
				const sales = data["sales-list"];
				return sales;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
    }

    useEffect(() => {
		reportStoreChainSales(shopper.uuid).then((sales) => {
			setSalesList(sales);
		});
	}, []);

    return (
        <div>
            <label>Store Chain Sales</label>
            <div>
				{salesList.map((item: any, index: number) => (
					<p key={index}>
						{item["chain-name"]}: ${item["total-sales"]}
					</p>
				))}
			</div>
        </div>
    );
}
