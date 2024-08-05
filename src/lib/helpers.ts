export function fromFormData<TData, TParams extends object>(
  action: (params: TParams) => Promise<TData>
) {
  return async (formData: FormData) => {
    "use server"

    const params = Object.fromEntries(formData.entries()) as TParams
    const response = await action(params)

    return response
  }
}
