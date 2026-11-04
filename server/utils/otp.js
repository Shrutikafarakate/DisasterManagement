const { randomInt } = require("crypto");

const OTP_TTL_MS = 5 * 60 * 1000;

const generateOtp = () => randomInt(100000, 1000000).toString();

const isValidOtp = (record, value) => {
  if (!record || typeof value !== "string" || !/^\d{6}$/.test(value)) {
    return false;
  }

  const createdAt = record.createdAt instanceof Date
    ? record.createdAt.getTime()
    : NaN;
  const age = Date.now() - createdAt;

  return record.otp === value && age >= 0 && age < OTP_TTL_MS;
};

module.exports = { generateOtp, isValidOtp };
