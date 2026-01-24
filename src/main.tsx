import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./componenets/Login";
import "./index.css";
// import Signup from "./componenets/signup";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>
      <div className=" rounded-lg text-6xl mb-10 font-serif text-cyan-600 font-semibold">
        Vaultit
      </div>
      <Login />
    </div>
  </StrictMode>
);
