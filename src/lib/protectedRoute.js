import React from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "src/contexts/appContext";
import * as API from "src/api/request";

const ProtectedRoute = () => {
  const { state, dispatch } = useAppContext();
  var token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token == null) {
    API.API()
      .get(`/auth`)
      .then((res) => {
        const result = res.data;
        let url = result.url;
        if (window.location.hostname === "localhost") {
          url = url.replace(
            "https://safetyjob.tk/callback",
            "http://localhost:3000/callback"
          );
        }
        window.location.replace(url);
      });
  } else {
    if (state.tn === 0) {
      API.getUserInfo().then((res) => {
        dispatch({
          type: "LOG_IN",
          data: res,
        });
      });
    } else return <Outlet />;
  }

  // return token !== null || state.loggedIn ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/login" />
  // );
};

export default React.memo(ProtectedRoute);
