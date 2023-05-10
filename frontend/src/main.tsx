import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {QueryClient, QueryClientProvider} from "react-query";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {RecoilRoot} from "recoil";

const queryClient = new QueryClient();
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
    <Init />
  </RecoilRoot>,
);

function Init() {
  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}
