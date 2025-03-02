import React from "preact";
import { Brand } from "../components/Header/Brand";
import { Links } from "../components/Header/Links";
import { Banner } from "../components/Header/Banner";
import { Search } from "../components/Header/Search";
import { ExternalLinks } from "../components/Header/ExternalLinks";

const Header = ({ title, icon, links, banners }: { title: string, icon: string, links: EasyDocsLink[], banners: EasyDocsBanner[] }) => {
  return (
    <>
      {
        <div class="banners">
          <Banner title="Some example banner !!" />
        </div>
      }

      <header>
        <div class="inner">
          <div class="navbar">
            <Brand title={title} icon={icon} />
            {links && <Links links={links} />}
          </div>

          <div class="infos">
          <div>
              <button
                onClick={() =>
                  fetch("/build").then(() => window.location.reload())
                }
              >
                Build
              </button>
            </div>
            <Search />
            <ExternalLinks />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
