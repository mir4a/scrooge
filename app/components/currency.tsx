import { toCurrency } from "~/utils/currency-formatter";

export interface CurrencyProps {
  amount: number;
  coloured?: boolean;
  className?: string;
}

export default function Currency({
  amount,
  coloured,
  className,
}: CurrencyProps) {
  const formattedAmount = toCurrency(amount);
  const isNegative = amount < 0;
  const isPositive = amount > 0;
  const colour = isNegative
    ? "text-red-500"
    : isPositive
    ? "text-green-500"
    : "text-gray-500";
  const classNames = ["font-bold", coloured && colour, className]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{formattedAmount}</span>;
}
