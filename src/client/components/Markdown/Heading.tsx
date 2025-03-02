import { Link } from "wouter-preact";


export function Heading({ id = '', level = 1, children, className }: any) {
  return (
    <Link href={`#${id}`}>
      { children }
    </Link>
  )
}