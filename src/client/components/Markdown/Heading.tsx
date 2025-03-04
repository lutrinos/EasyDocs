import { Link } from "wouter-preact";


export function Heading({ id = '', level = 1, children, className }: any) {
  const Header = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  return (
    <Link asChild href={`#${id}`}>
      <Header>{ children }</Header>
    </Link>
  )
}