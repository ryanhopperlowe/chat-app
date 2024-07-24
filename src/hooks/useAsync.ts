import { useCallback, useEffect, useState } from "react"

export function useAsync<TData, TParams extends unknown[]>(
  callback: (...params: TParams) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(
    (...params: TParams) => {
      setLoading(true)

      const promise = callback(...params)

      promise
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false))

      return promise
    },
    [callback]
  )

  return { data, error, loading, execute }
}

export function useFetch<
  TData,
  TParams extends Record<string, string | number | boolean>
>(url: string) {
  return useAsync<TData, [TParams]>(async (params) => {
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")

    const res = await fetch(url + "?" + paramString, {
      method: "GET",
    })

    if (!res.ok) {
      throw new Error("Error fetching data")
    }

    return await res.json()
  })
}

export function useRequest<TData, TBody extends object>(
  url: string,
  method: string
) {
  return useAsync(async (body: TBody) => {
    const res = await fetch(url, {
      method,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error during request")
    }

    return (await res.json()) as TData
  })
}
