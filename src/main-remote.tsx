// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes, Route
} from "react-router";
import "@/lib/i18n";

import "./style.css";
import UiWrapper from "./views/UiWrapper";
import RemoteWelcomePage from "@/pages/RemoteWelcomePage.tsx";
import RemoteDisplayPage from "@/pages/RemoteDisplayPage.tsx";

const rootEl = document.getElementById("root")
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  // <StrictMode>
  <BrowserRouter>
    <UiWrapper>
      <Routes>
        <Route path="/display/" element={<RemoteWelcomePage />} />
        <Route path="/display/:code" element={<RemoteDisplayPage />} />
      </Routes>
    </UiWrapper>
  </BrowserRouter>
  // </StrictMode>
);
