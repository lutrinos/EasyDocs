import React from "preact";
import { Brand } from "../components/Header/Brand";
import { Links } from "../components/Header/Links";
import { Banner } from "../components/Header/Banner";
import { Search } from "../components/Header/Search";

const Header = () => {
  return (
    <header class="sticky top-0 flex flex-col w-full z-10">
      <Banner />

      <div className="navbar bg-base-100 border-b border-b-base-500">
        <div class="navbar-start">
          <Brand />
        </div>

        <div className="navbar-end flex flex-row gap-4">

          <Links />
          <Search />

          <button
            className="btn btn-primary"
            onClick={() =>
              fetch("/build").then(() => window.location.reload())
            }
          >
            Build
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
