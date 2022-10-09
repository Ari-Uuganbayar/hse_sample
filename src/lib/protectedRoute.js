import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppContext } from "src/contexts/appContext";

const ProtectedRoute = () => {
  const { state } = useAppContext();
  var token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return token !== null || state.loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default React.memo(ProtectedRoute);
