export const convertToCurrency = (num: number | undefined) => {
  if(!num && num !== 0) return;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(num);
};
