import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./input.css";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import SignIn from "./SignIn";
import Registration from "./Registration";
import Table from "./Table";

const AuthUser = ({ userInfo }) => {
  if (userInfo !== null) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

const App = () => {
  const [userInfo, setUserInfo] = useState(undefined); // undefined | null | Object

  useEffect(() => {
    fetch(`/userinfo`, { credentials: "include" })
      .then((result) => {
        if (result.status === 404) {
          return Promise.resolve(null);
        } else {
          return result.json();
        }
      })
      .then((result) => {
        setUserInfo(result);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/reg" element={<Registration />} />
        <Route element={<AuthUser userInfo={userInfo} />}>
          <Route path="/users-table" element={<Table userInfo={userInfo} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
