import { sample, times } from 'lodash';

export const generateVerificationCode = (length = 4) => {
  // TODO: Remove this line once we can send SMS
  // eslint-disable-next-line no-constant-condition
  if (true) return '6666';
  return times(length, () => sample('0123456789')).join('');
};
