import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {QueryClient, QueryClientProvider} from "react-query";
import {GoogleOAuthProvider} from "@react-oauth/google";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
