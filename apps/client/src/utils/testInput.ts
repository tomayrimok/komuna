import { escapeRegExp } from 'lodash';

export const testInput = (value = '', input = '') => {
  input = escapeRegExp(input);
  const regex = new RegExp('(?=.*' + input.toLowerCase() + ')');
  return regex.test(value.toLowerCase());
};
