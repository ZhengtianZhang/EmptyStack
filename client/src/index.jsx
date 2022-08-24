import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import VerifyUser from './components/VerifyUser'
import Question from './components/Question'
import Profile from './components/Profile'
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import "./style/normalize.css";
import "./style/index.css";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/verify-user`}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/:id" element={<Question />} />
            <Route path="/user/:id" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);