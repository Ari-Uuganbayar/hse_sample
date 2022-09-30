import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContext from "src/contexts/appContext";

import Login from "src/pages/login";
import Router from "src/router";

import "src/assets/css/tailwind.css";
import "antd/dist/antd.min.css";
import { ConfigProvider } from "antd";
import mn from "antd/lib/locale/mn_MN";
import "moment/locale/mn";

function App() {
  return (
    <ConfigProvider locale={mn}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
        </Routes>
        <AppContext>
          <Router />
        </AppContext>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default React.memo(App);
