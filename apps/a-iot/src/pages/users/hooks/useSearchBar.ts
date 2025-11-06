import { useState, useMemo, useCallback } from 'react';

export const useSearchBar = <T extends Record<string, any>>(
  data: T[],
  searchFields: (keyof T)[]
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowerSearch = searchTerm.toLowerCase();

    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];

        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearch);
        }

        return false;
      })
    );
  }, [data, searchTerm, searchFields]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    filteredData,
    handleSearch,
  };
};

