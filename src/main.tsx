// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes, Route
} from "react-router";
import "@/lib/i18n";

import "./index.css";
import Welcome from "@/pages/Welcome.tsx";
import SignIn from "@/pages/SignIn.tsx";
import SignUp from "@/pages/SignUp.tsx";
import ConfPage from "@/pages/ConfPage.tsx";
import GamePage from "@/pages/GamePage.tsx";
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
        <Route path="/" element={<Welcome />} />
        <Route path="/setup/*" element={<ConfPage />} />
        <Route path="/game/*" element={<GamePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/display/" element={<RemoteWelcomePage />} />
        <Route path="/display/:code" element={<RemoteDisplayPage />} />
      </Routes>
    </UiWrapper>
  </BrowserRouter>
  // </StrictMode>
);
