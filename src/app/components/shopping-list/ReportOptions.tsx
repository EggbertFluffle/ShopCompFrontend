import ReportOptionItem from "./ReportOptionItem";
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
type ReportItem = {
  "item-uuid": string;
  name: string;
  options: Option[];
};
export default function ReportOptions({
  items,
}: {
  items: ReportItem[];
}) {
  if (!items || items.length === 0) {
    return <div>Report options from a shopping list to see options</div>;

    //vhat?
  }
  return (
    <>
      {items.map((item) => (
        <div key={item["item-uuid"]}>
          <div>
            <div className="options-header">{item.name}  - &nbsp;
              {item.options?.length ?? 0} option
              {item.options && item.options.length !== 1 ? "s" : ""}
            </div>
          </div>

          {item.options && item.options.length > 0 && (
            <div>
              {item.options.map((opt) => (
                <ReportOptionItem key={opt["item-uuid"]} option={opt} />
              ))}
            </div>
          )
          }
        </div>
      ))}
    </>
  );
}

