import React from "react";

import { MenuStoreProvider } from "store";
import Test from "components/test";
import Navigation from "components/navigation";

const App = () => (
  <MenuStoreProvider>
    <Test />
    <Navigation />
  </MenuStoreProvider>
);

export default App;
