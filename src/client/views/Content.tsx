import { StateUpdater, useCallback, useEffect, useState } from "preact/hooks"

import preact from "preact/compat";
import { useLocation } from "wouter-preact";
import markdoc, { Fence, Heading, Tab, Tabs } from "../components/Markdown";
import { useToc } from "../states/toc";

const Content = () => {
  const [url, _] = useLocation();
  const [json, setJson] = useState(false);
  const scroll = useToc((state) => state.scroll);

  const hashListener = useCallback(() => {
    if (window.location.hash) {
      scroll(window.location.hash.substring(1));
    }
  }, [scroll]);

  useEffect(() => {
    if (window) {
      //scroll(window.location.hash?.substring(1));
      window.addEventListener('hashchange', hashListener);

      return () => {
        window.removeEventListener('hashchange', hashListener);
      }
    }
  }, []);

  useEffect(() => {
    console.log(url);
    fetch(`/_${url}.json`)
      .then((res) => res.json())
      .then((value) => {
        setJson(value);
      });
  }, [url]);

  if (json) {
    return (
      <div class="prose">{markdoc(json, preact, {
        components: {
          Tabs,
          Tab,
          Fence,
          Heading
        },

      })}</div>
    );
  }

  return (
    <div style={{ flex: 1, padding: 20 }} class="content" />
  );
}

export default Content