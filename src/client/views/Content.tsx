import { useEffect, useState } from "preact/hooks"

import preact from "preact/compat";
import { useLocation } from "wouter-preact";
import markdoc, {Fence, Tab, Tabs } from "../components/Markdown";

const Content = () => {
  const [url, _] = useLocation();
  const [json, setJson] = useState(false);

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
      <div style={{ flex: 1, padding: 20 }} class="content">{ markdoc(json, preact, {
        components: {
          Tabs,
          Tab,
          Fence
        },
      }) }</div>
    );
  }

  return (
    <div style={{ flex: 1, padding: 20 }} class="content"></div>
  );
}

export default Content