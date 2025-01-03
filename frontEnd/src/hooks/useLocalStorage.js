import { useState, useEffect } from 'react'
function useLocalStorage (key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // get value from local storage by key
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })
  useEffect(() => {
    try {
      const valueStore =
        typeof storedValue === 'function'
          ? storedValue(storedValue)
          : storedValue
      window.localStorage.setItem(key, JSON.stringify(valueStore))
    } catch (error) {
      console.log(error)
    }
  }, [key, storedValue])
  return [storedValue, setStoredValue]
}
export default useLocalStorage