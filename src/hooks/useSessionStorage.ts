import { useState, useEffect } from "react";

const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = sessionStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error("Error accessing sessionStorage for key:", key, error);
        setStoredValue(initialValue);
      }
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window !== "undefined") {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue as T) : value;
        setStoredValue(valueToStore);
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error setting sessionStorage for key:", key, error);
      }
    }
  };

  return [storedValue, setValue] as const;
};

export default useSessionStorage;
