// utils/finance.js
exports.calculateMetrics = (data) => {
  const { income, expenses, savings } = data;

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);

  const savingsRatio = savings / income;
  const expenseRatio = totalExpenses / income;

  return {
    totalExpenses,
    savingsRatio,
    expenseRatio
  };
};
