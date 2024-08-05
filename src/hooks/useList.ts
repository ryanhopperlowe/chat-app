import { useState } from "react"

export function useList<T>(defaultState: T[] = []) {
  const [state, setState] = useState<T[]>(defaultState)

  const add = (item: T) => {
    setState((prev) => [...prev, item])
  }

  const remove = (item: T) => {
    setState((prev) => prev.filter((i) => i !== item))
  }

  return { state, add, remove }
}
