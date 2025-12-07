const calculateTotalPrice = (
  startDate: string,
  endDate: string,
  daily_rent_price: number
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalPrice = diffDays * Number(daily_rent_price);
  return totalPrice.toFixed(2) as unknown as number;
};

export default calculateTotalPrice;
