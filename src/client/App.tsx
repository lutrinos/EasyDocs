import { hydrate, render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Route, Router, Switch } from "wouter-preact";
import Header from "./views/Header";
import Body from "./views/Body";
import Footer from "./views/Footer";

function App() {
  /*const [value, setValue] = useState(10);

  useEffect(() => {
    if (window.document) {
      document.querySelector(".seo")?.remove();
    }
  }, []);*/

  return (
    <div class="relative flex flex-col items-center">
      <Router>
        <Header />

        <Switch>
          <Route>
            <Body />
          </Route>
        </Switch>

        <Footer />
      </Router>
    </div>
  );
}

document.body.innerHTML = '';
render(<App />, document.body);