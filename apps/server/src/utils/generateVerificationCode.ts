import { sample, times } from 'lodash';
import { isSMSEnabled } from './isSMSEnabled';

const DEFAULT_VERIFICATION_CODE = '6666';

export const generateVerificationCode = (length = 4) => {
  if (!isSMSEnabled()) return DEFAULT_VERIFICATION_CODE;
  return times(length, () => sample('0123456789')).join('');
};
