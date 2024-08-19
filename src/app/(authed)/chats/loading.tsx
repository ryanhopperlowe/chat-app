import { Spinner } from "@nextui-org/react"

export default function Loading() {
  return (
    <main className="h-full w-full flex flex-col items-center pt-[25%]">
      <Spinner size="lg" />
    </main>
  )
}
