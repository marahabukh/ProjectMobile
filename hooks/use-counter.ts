import { useState } from "react";

function useCounter(initialValue = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset, setCount };
}

export default useCounter;