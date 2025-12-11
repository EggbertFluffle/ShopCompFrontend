type Store = {
  "store-uuid": string;
  address: string;
};
type Receipt = {
  date: string;
  "store-chain-name": string;
  "store-chain-url": string;
  store: Store;
};
type Option = {
  "item-uuid": string;
  name: string;
  price: number;
  quantity: number;
  "receipt-uuid": string;
  receipt: Receipt;
};
export default function ReportOptionItem({ option }: { option: Option }) {
  const price = option.price.toFixed(2);
  const quantity = option.quantity;
  const receiptDate = new Date(option.receipt.date).toLocaleDateString();
  const storeAddress = option.receipt.store.address;
  const storeChain = option.receipt["store-chain-name"];
  const storeChainUrl = option.receipt["store-chain-url"];
  return (
		<div className="single-option">
			<div>
				{option.name} - ${price}
			</div>
			<div>
				<a
					href={storeChainUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{storeChain}
				</a>
				&nbsp;({storeAddress})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
  );
}

