import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

  import "./index.css";

import SignInPage1 from "./pages/sign-in";
import SignUpPage2 from "./pages/sign-up-email";
import SignUpPage3 from "./pages/sign-up-pw";
import ResetPWRQ from "./pages/reset-pw-rq";
import ResetPW from "./pages/reset-pw";

import App from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/sign-in"
            element={
             
                <SignInPage1 />
              
            }
          />
          <Route
            path="/sign-up-email"
            element={
            
                <SignUpPage2 />
              
            }
          />
          <Route
            path="/sign-up-pw"
            element={
          
                <SignUpPage3 />
              
            }
          />
          <Route path="/reset-pw-rq" element={<ResetPWRQ />} />
          <Route path="/reset-pw" element={<ResetPW />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );



 
