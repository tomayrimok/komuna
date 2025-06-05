import { sample, times } from 'lodash';
import { isSMSEnabled } from './isSMSEnabled';

const DEFAULT_VERIFICATION_CODE = '6666';

export const generateLoginCode = (length = 4) => {
  if (!isSMSEnabled()) return DEFAULT_VERIFICATION_CODE;
  return generateVerificationCode(length);
};

/** Also in development, apartment code must be random */
export const generateApartmentCode = (length = 4) => {
  return generateVerificationCode(length);
};

const generateVerificationCode = (length = 4) => {
  return times(length, () => sample('0123456789')).join('');
};
