import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { SearchProvider } from "./context/search";
import { CartProvider } from "./context/cart";
import { DarkModeProvider } from "./Themes/DarkModeContext"; // Import DarkModeProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <DarkModeProvider>
          {" "}
          {/* Wrap with DarkModeProvider */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DarkModeProvider>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);

reportWebVitals();
