import { useMemo, useState } from 'react';

export const useFilterList = <T>(list: T[], filterFunction: (list: T[], searchValue: string) => T[]) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredResults = useMemo(() => {
    return filterFunction(list, searchValue);
  }, [list, searchValue]);

  return { filteredResults, handleChange, searchValue };
};
