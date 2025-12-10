"use client";
import "./page.css";

import { useState, useEffect } from "react";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Dashboard() {
	const [receipts, setReceipts] = useState([]);
	const [activityTotal, setActivityTotal] = useState(0);
	const [period, setPeriod] = useState("all-time");

	const reviewHistory = async (shopperUUID: string) => {
		return instance
			.post("review-history", {
				"shopper-uuid": shopperUUID,
			})
			.then((response) => {
				const data = JSON.parse(response.data.body);
				const receipts = data.receipts;
				filter("");
				return receipts;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
	}

	useEffect(() => {
		reviewHistory(shopper.uuid)
			.then((list) => {
				setReceipts(list);
			})
	}, []);

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

	let [filteredItems, setFilteredItems] = useState([]);
	const filter = (search: string) => {
		let out = [];
		for(let r of receipts) {
			for(let i of r.items) {
				const name: string = i.name;
				if(search == "" || name.includes(search)) {
					let item = i;
					i.storeAddress = r.store.address;
					out.push(item);
				}
			}
		}
		setFilteredItems(out);
	}

	return (
		<div>
			{/* <h1 className="username">Shopper: {shopper.username}</h1> */}
			<h2 className="review-activity">Review Activity for
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
				spending: ${activityTotal.toFixed(2)}
			</h2>
			<div className="container">
				<div className="other-thing">
					<div className="receipts-container">
						<h2>Receipt History</h2>
						<div className="receipts-inner-container">
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
				</div>
				<div className="search-history-container">
					<h2 className="review-history">Search History</h2>
					<div className="search-history">
						<label className="search-input">Search: <input type="text" onChange={(e) => { filter(e.target.value); }} /></label>
						<table className="table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Price</th>
									<th>Store Address</th>
								</tr>
							</thead>
							<tbody>
								{filteredItems.map((i) => {
									return <tr key={i["item-uuid"]}>
										<td>{i.name}</td>
										<td>{i.price}</td>
										<td>{i.storeAddress}</td>
									</tr>
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
