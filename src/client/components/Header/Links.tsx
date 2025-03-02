import { Link } from "wouter-preact";

export const Links = ({ links }: { links: EasyDocsLink }) => {
  return (
    <nav>
      {links.map((link) => (
        <Link href={link.url} >{link.title}</Link>
      ))}
    </nav>
  );
};
