"use client";
import "./page.css";

import OpenAI from "openai";
import { useRef, useState, useEffect } from "react";

export default function AnalyzeModal({ onParsed, onClose }) {
	const [apiKey, setApiKey] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [summary, setSummary] = useState("");
	const [analyzeError, setAnalyzeError] = useState("");

	const handleFileChange = (e) => {
		console.log(e.target.files[0]);
		setSelectedFile(e.target.files[0]);
		console.log("file has changed");
	};

	const handleReceiptAnalysis = async () => {
		if (selectedFile == null || apiKey == "") {
			setAnalyzeError("Please select a valid image file to be analyzed");
			return;
		} else if (apiKey == "") {
			setAnalyzeError("Please enter a valid OpenAPI Key");
			return;
		}

		const dataUrl = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(selectedFile);
		});

		const client = new OpenAI({
			apiKey: apiKey,
			dangerouslyAllowBrowser: true,
		});

		const response = await client.responses.create({
			model: "gpt-4o",
			input: [
				{
					role: "user",
					content: [
						{
							type: "input_text",
							text: 'Summarize the content of this receipt image. In a JSON format, without markdown code blocks, store name, receipt date yyyy-mm-dd, then Items with their info. Make up item category if not provided. Item Quantity defaults to 1 if not provided.  Exmaple: { "store-name: : "Chicken Bap", "date" : "2025-11-14", "items" : [ { "name" : "Chicken Tenders", "price" : "12.99", "category" : "Meat", "quantity" : "2" }, { "name" : "Fries", "price" : "6.49", "category" : "Side", "quantity" : "4" } ] }',
						},
						{ type: "input_image", image_url: dataUrl },
					],
				},
			],
			max_output_tokens: 500,
		} as any);

		let receiptOutput = JSON.parse(response.output_text);
		console.log(receiptOutput); //debugging

		onParsed(receiptOutput);
	};

	return (
		<div className="modal-overlay">
			<div className="ai-receipt-section modal-box">
				<h2>Analyze With AI</h2>
				<br/>
				<label>OpenAI API Key:</label>
				<input
					className="api-field"
					type="text"
					placeholder="OpenAI API Key"
					onChange={(e) => {
						setApiKey(e.target.value);
					}}
				/>
				<input
					className="upload-section"
					type="file"
					accept="image/*, .pdf"
					onChange={handleFileChange}
				/>

				<div className="flex">
					<button className="cancel-button" onClick={onClose}>
						Cancel
					</button>
					<button
						className="analyze-button"
						onClick={handleReceiptAnalysis}
					>
						Analyze Receipt
					</button>
				</div>
			</div>
		</div>
	);
}
