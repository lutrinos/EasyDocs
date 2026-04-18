import { Link } from "wouter-preact";

export const Links = () => {
  return (
    <nav class="flex flex-row gap-4">
      <Link class="link link-hover" href="/about" >À propos</Link>
      <Link class="link link-hover" href="https://www.github.com/lutrinos/EasyDocs">GitHub</Link>
    </nav>
  );
};
