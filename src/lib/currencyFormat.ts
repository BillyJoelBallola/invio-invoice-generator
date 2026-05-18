import { formatCurrency } from "@automattic/format-currency";

export function currencyFormat(value: number | string) {
  const parsedValue = typeof value === "string" ? parseInt(value) : value;
  const formatted = formatCurrency(parsedValue, "PHP")
    .split("₱")[1]
    .split(".")[0];
  return formatted;
}
