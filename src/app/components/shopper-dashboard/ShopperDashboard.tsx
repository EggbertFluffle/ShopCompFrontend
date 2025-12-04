"use client";
import { useState } from "react";
import { ViewState } from "./components/lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Dashboard(){
    const [receipts, setReceipts] = useState([]);

    function returnUsername(shopperUUID: srting){
        //return shopper's username in shopper dashboard
    }

    function reviewHistory(shopperUUID: string) {
		return instance
			.post("review-history", {
				"shopper-uuid": shopperUUID,
			})
			.then((response) => {
				const data = JSON.parse(response.data.body);
				const receipts = data.receipts;

				console.log("Receipts:", receipts); // debugging

				return receipts;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
	}


    function reviewActivity(shopperUUID: string, timePeriod: string){
        // return spending summary based on timePeriod option (lastDay, lastWeek, lastMonth, allTime)
    }

    function formatDate(isoDate: string) { //GPT
		const clean = isoDate.split("T")[0];
		const [year, month, day] = clean.split("-");
		return `${month}/${day}/${year}`;
	}


    return (
		<div>
			<label>{}</label>

			<button
				onClick={() => {
					reviewHistory(shopper.uuid).then((list) => {
						setReceipts(list);
					});
				}}
			>
				Review History
			</button>
			<div>
				{receipts.map((r) => (
					<div key={r["receipt-uuid"]}>
						<p>Date: {formatDate(r.date)}</p>
						<p>Store: {r.store.address}</p>
						<p>Items:</p>
						<ul>
							{r.items.map((item) => (
								<li key={item["item-uuid"]}>
									{item.name} — ${item.price} ×{" "}
									{item.quantity}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<label>Review Activity</label>
			<select>
				<option value="all-time">All Time</option>
				<option value="last-day">Last Day</option>
				<option value="all-week">Last Week</option>
				<option value="all-month">Last Month</option>
			</select>
		</div>
	);
}