"use client";
import "./page.css";

import { useState, useEffect } from "react";
import { ViewState } from "./components/lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Dashboard() {
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

			function inRange(dateString: string) {
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

				return true;
			}

			const filtered = receipts.filter((r) => inRange(r.date));

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

	function formatDate(isoDate: string) {
		const clean = isoDate.split("T")[0];
		const [year, month, day] = clean.split("-");
		return `${month}/${day}/${year}`;
	}

	useEffect(() => {
		reviewActivity(shopper.uuid, "all-time").then((total) => {
			setActivityTotal(total);
		});
	}, []);

	return (
		<div>
			<label className="username">Shopper: {shopper.username}</label>

			<label className="review-activity">Review Activity:</label>
			<select
				className="review-period-select"
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

			<p className="total-spending">Total Spending: ${activityTotal.toFixed(2)}</p>

			<button
				className="review-history-button"
				onClick={() => {
					reviewHistory(shopper.uuid).then((list) => {
						setReceipts(list);
					});
				}}
			>
				Review History
			</button>

			<div>
				{receipts.map((r) => {
					const receiptTotal = r.items.reduce(
						(sum, item) => sum + item.price * item.quantity,
						0
					);

					return (
						<div className="receipt-card" key={r["receipt-uuid"]}>
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

							<p className="receipt-total">
								Total: ${receiptTotal.toFixed(2)}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
