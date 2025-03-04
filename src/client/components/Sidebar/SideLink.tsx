import { ChevronRight } from "lucide-preact";
import { Link } from "wouter-preact";

const SideLink = ({ title, href, type = 0, opened, onOpen }) => {
  return (
    <Link class="sidelink" href={href}>
      {title}
      {type === 1 && (
        <span class={opened ? ' open' : ''} onClick={onOpen}>
          <ChevronRight />
        </span>
      )}
    </Link>
  );
};

export default SideLink;
