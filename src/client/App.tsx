import { hydrate } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Route, Router, Switch } from "wouter-preact";
import Header from "./views/Header";
import Body from "./views/Body";
import Footer from "./views/Footer";

function App() {
  const [value, setValue] = useState(10);

  useEffect(() => {
    if (window.document) {
      document.querySelector(".seo")?.remove();
    }
  }, []);
  
  return (
    <Router>
      <Header
        title="nathanTi"
        icon={{
          alt: "icon",
          src: "https://ntillier.github.io/_/profile.png",
          width: 30,
          height: 30,
        }}
        links={[
          {
            title: "About",
            url: "/about",
          },
          {
            title: "GitHub",
            url: "https://github.com",
          },
        ]}
      />

      <Switch>
        <Route>
          <Body />
        </Route>
      </Switch>

      <Footer />
    </Router>
  );
}

hydrate(<App />, document.getElementById("app") as HTMLElement);
