export const isSMSEnabled = () => {
  return (
    process.env.SMS_ENABLED === 'true' &&
    process.env.SMS_LOCAL_ADDRESS &&
    process.env.SMS_USERNAME &&
    process.env.SMS_PASSWORD
  );
};
