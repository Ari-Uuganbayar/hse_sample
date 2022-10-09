import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  let auth = { loggedIn: true };

  return auth.loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default React.memo(ProtectedRoute);
