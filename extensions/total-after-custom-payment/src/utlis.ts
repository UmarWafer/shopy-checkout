export const formatMoney = (amount: number) => {
    const amt = amount > 0 ? amount : 0;
    return "$" + (amt / 100).toFixed(2);
  };

