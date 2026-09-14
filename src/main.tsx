import { Theme } from "@radix-ui/themes";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./ux.css";
import "@radix-ui/themes/styles.css";
import "./design-system.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme
      appearance="light"
      accentColor="grass"
      grayColor="sand"
      radius="medium"
      panelBackground="solid"
    >
      <App />
    </Theme>
  </React.StrictMode>,
);
