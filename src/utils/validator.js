const isValidEmail = (email) => {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

const isValidAmount = (amount) => {
  return (
    typeof amount === "number" &&
    !isNaN(amount) &&
    amount > 0
  );
};

module.exports = {
  isValidEmail,
  isValidAmount,
};