import { Link } from "@nextui-org/react"
import { ComponentProps } from "react"
import NextLink from "next/link"

export function MyLink(props: ComponentProps<typeof Link>) {
  return <Link as={NextLink} {...props} />
}
