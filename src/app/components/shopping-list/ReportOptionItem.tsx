type Store = {
  "store-uuid": string;
  address?: string;
};
type Receipt = {
  date?: string;
  "store-chain-name"?: string;
  "store-chain-url"?: string;
  store?: Store;
};
type Option = {
  "item-uuid": string;
  name: string;
  price?: number;
  quantity?: number;
  "receipt-uuid"?: string;
  receipt?: Receipt;
};
export default function ReportOptionItem({ option }: { option: Option }) {
  const price = option.price != null ? `$${option.price}` : "—";
  const quantity = option.quantity != null ? option.quantity : "—";
  const receiptDate =
    option.receipt?.date != null
      ? new Date(option.receipt.date).toLocaleDateString()
      : "—";
  const storeAddress = option.receipt?.store?.address ?? "—";
  const storeChain = option.receipt?.["store-chain-name"] ?? "—";
  return (
    <div>
      <div>{option.name}</div>
      <div>
        Price: {price} · Quantity: {quantity}
      </div>
      <div>
        Receipt: {receiptDate} · Store Chain: {storeChain}
      </div>
      <div>Address: {storeAddress}</div>
    </div>
  );
}

