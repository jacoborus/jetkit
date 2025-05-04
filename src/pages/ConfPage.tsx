import { Routes, Route } from "react-router";

import QuickConfPage from "./QuickConfPage";
import CustomConfPage from "./CustomConfPage";

export default function ConfPage() {
  return (
    <div className="p-5 flex flex-col items-stretch">
      <Routes>
        <Route path="/" element={<QuickConfPage />} />
        <Route path="/custom" element={<CustomConfPage />} />
      </Routes>
    </div>
  );
}
