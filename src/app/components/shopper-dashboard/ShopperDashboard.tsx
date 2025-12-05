"use client";
import { useState, useEffect } from "react";
import { ViewState } from "./components/lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Dashboard(){
    const [receipts, setReceipts] = useState([]);
	const [activityTotal, setActivityTotal] = useState(0);
	const [period, setPeriod] = useState("all-time");

    function reviewHistory(shopperUUID: string) {
		return instance
			.post("review-history", {
				"shopper-uuid": shopperUUID,
			})
			.then((response) => {
				const data = JSON.parse(response.data.body);
				const receipts = data.receipts;

				//for debugging NO NOT DELETE
				//console.log("Receipts:", receipts);

				return receipts;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
	}


    function reviewActivity(shopperUUID: string, timePeriod: string) {
		return reviewHistory(shopperUUID).then((receipts) => {
			const now = new Date();

			// helper to check if receipt matches a time window
			function inRange(dateString: string) { //GPT
				const d = new Date(dateString);

				if (timePeriod === "last-day") {
					const oneDayAgo = new Date(
						now.getTime() - 24 * 60 * 60 * 1000
					);
					return d >= oneDayAgo;
				}

				if (timePeriod === "last-week") {
					const oneWeekAgo = new Date(
						now.getTime() - 7 * 24 * 60 * 60 * 1000
					);
					return d >= oneWeekAgo;
				}

				if (timePeriod === "last-month") {
					const oneMonthAgo = new Date();
					oneMonthAgo.setMonth(now.getMonth() - 1);
					return d >= oneMonthAgo;
				}

				// all-time
				return true;
			}

			const filtered = receipts.filter((r) => inRange(r.date)); //GPT

			// total spending = sum of all (price × quantity)
			const total = filtered.reduce((sum, r) => {
				return (
					sum +
					r.items.reduce((itemSum, item) => {
						return itemSum + item.price * item.quantity;
					}, 0)
				);
			}, 0);

			return total;
		});
	}


    function formatDate(isoDate: string) { //GPT
		const clean = isoDate.split("T")[0];
		const [year, month, day] = clean.split("-");
		return `${month}/${day}/${year}`;
	}

	useEffect(() => { //shows total spending by default (option is all-time)
		reviewActivity(shopper.uuid, "all-time").then((total) => {
			setActivityTotal(total);
		});
	}, []);



    return (
		<div>
			<label>Shopper Username: {shopper.username}</label>

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
						<p>
							Store: ({r.chainName}) {r.store.address}
						</p>
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
			<select
				value={period}
				onChange={(e) => {
					const p = e.target.value;
					setPeriod(p);

					reviewActivity(shopper.uuid, p).then((total) => {
						setActivityTotal(total);
					});
				}}
			>
				<option value="all-time">All Time</option>
				<option value="last-day">Last Day</option>
				<option value="last-week">Last Week</option>
				<option value="last-month">Last Month</option>
			</select>

			<p>Total Spending: ${activityTotal.toFixed(2)}</p>
		</div>
	);
}