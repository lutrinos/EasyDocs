import { useToc } from "@/client/states/toc";
import { useEffect, useRef, useState } from "preact/hooks";
import { Link } from "wouter-preact";


export function Heading({ id = '', level = 1, label, children, className }: any) {
  const Header = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  const push = useToc((state) => state.push);
  const currentId = useToc((state) => state.current);
  const [index, setIndex] = useState<number>();
  const item = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setIndex(push(label, id, level));
  }, []);

  useEffect(() => {
    if (item.current && currentId === id) {
      item.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [currentId]);

  if (level <= 2) {
    return (
      <Link asChild href={`#${id}`}>
        <Header ref={item} data-index={index}>{ children }</Header>
      </Link>
    )
  }

  return  <Header>{ children }</Header>
}