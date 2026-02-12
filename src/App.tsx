import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ComponentExample } from "@/components/component-example";
import Demo from "@/pages/Demo";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComponentExample />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

