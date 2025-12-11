"use client";
import "./page.css";
import { useState, useEffect } from "react";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function Dashboard() {
	const getDefaultDates = () => {
		const today = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(today.getMonth() - 1);

		const formatDateForInput = (date: Date) => {
			return date.toISOString().split('T')[0];
		};

		return {
			start: formatDateForInput(oneMonthAgo),
			end: formatDateForInput(today)
		};
	};

	const defaultDates = getDefaultDates();
	const [receipts, setReceipts] = useState([]);
	const [activityTotal, setActivityTotal] = useState(0);
	const [startDate, setStartDate] = useState(defaultDates.start);
	const [endDate, setEndDate] = useState(defaultDates.end);

	const reviewHistory = async (shopperUUID: string) => {
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

	function reviewActivity(shopperUUID: string, start: string, end: string) {
		return reviewHistory(shopperUUID).then((receipts) => {
			function inRange(dateString: string) {
				const d = new Date(dateString);
				const startD = start ? new Date(start) : null;
				const endD = end ? new Date(end) : null;

				if (startD && d < startD) return false;
				if (endD && d > endD) return false;
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

	useEffect(() => {
		reviewActivity(shopper.uuid, startDate, endDate)
			.then((total) => {
				setActivityTotal(total);
			});
		reviewHistory(shopper.uuid)
			.then((list) => {
				setReceipts(list);
			})
	}, []);

	useEffect(() => {
		filter("");
	}, [receipts]);

	useEffect(() => {
		reviewActivity(shopper.uuid, startDate, endDate).then((total) => {
			setActivityTotal(total);
		});
	}, [startDate, endDate]);

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
			<h2 className="review-activity">Review Activity
				<div className="date-range-inputs">
					<label>
						Start Date:
						<input
							className="date-picker"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</label>
					<label>
						End Date:
						<input
							className="date-picker"
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</label>
				</div>
				Total spending: ${activityTotal.toFixed(2)}
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
