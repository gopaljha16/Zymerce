// Currency formatting utility for INR
export const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatCurrencySimple = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
};
