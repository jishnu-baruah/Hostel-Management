const isMockPaymentMode = () => {
  return (process.env.PAYMENT_MODE || 'mock').toLowerCase() === 'mock';
};

module.exports = {
  isMockPaymentMode,
}; 