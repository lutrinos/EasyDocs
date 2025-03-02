import { Link } from "wouter-preact";

const SideLink = ({ title, href, type = 0, opened, onOpen }) => {
  return (
    <Link class="sidelink" href={href}>
      {title}
      {type === 1 && (
        <span class={`material-symbols-rounded${opened ? ' open' : ''}`} onClick={onOpen}>chevron_right</span>
      )}
    </Link>
  );
};

export default SideLink;
