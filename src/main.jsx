import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AdminAuthProvider } from "./admin/AdminAuthContext";
import { ContentAdminProvider } from "./admin/ContentAdminContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentAdminProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </ContentAdminProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
