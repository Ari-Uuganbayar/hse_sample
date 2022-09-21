import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContext from "src/contexts/userContext";
import MenuContext from "src/contexts/admin/menuContext";
import RoleContext from "src/contexts/admin/roleContext";
import PermissionContext from "src/contexts/admin/permissionContext";

import LocationContext from "src/contexts/locationContext";
import OrganizationContext from "src/contexts/organizationContext";
import ConditionContext from "src/contexts/conditionContext";
import SignatureContext from "src/contexts/signatureContext";
import ParameterTypeContext from "src/contexts/parameterTypeContext";
import ParameterContext from "src/contexts/parameterContext";
import SampleContext from "src/contexts/sampleContext";

import "src/assets/css/tailwind.css";
import "antd/dist/antd.min.css";
import { ConfigProvider } from "antd";
import mn from "antd/lib/locale/mn_MN";
import "moment/locale/mn";

import Login from "src/pages/login";
import Layout from "src/components/layout";
import Home from "src/pages/home";
import Menu from "src/pages/admin/menu";
import Role from "src/pages/admin/role";
import Permission from "src/pages/admin/permission";

import Location from "src/pages/location";
import Organization from "src/pages/organization";
import Condition from "src/pages/condition";
import Signature from "src/pages/signature";
import ParameterType from "src/pages/parameterType";
import Parameter from "src/pages/parameter";
import Sample from "src/pages/sample";

function App() {
  return (
    <ConfigProvider locale={mn}>
      <BrowserRouter>
        {window.location.pathname === "/login" ? (
          <Login />
        ) : (
          <UserContext>
            <Layout>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="admin">
                  <Route
                    exact
                    path="menu"
                    element={
                      <MenuContext>
                        <Menu />
                      </MenuContext>
                    }
                  />
                  <Route
                    exact
                    path="role"
                    element={
                      <RoleContext>
                        <Role />
                      </RoleContext>
                    }
                  />
                  <Route
                    exact
                    path="permission"
                    element={
                      <PermissionContext>
                        <Permission />
                      </PermissionContext>
                    }
                  />
                </Route>

                <Route
                  exact
                  path="/location"
                  element={
                    <LocationContext>
                      <Location />
                    </LocationContext>
                  }
                />
                <Route
                  exact
                  path="/organization"
                  element={
                    <OrganizationContext>
                      <Organization />
                    </OrganizationContext>
                  }
                />
                <Route
                  exact
                  path="/condition"
                  element={
                    <ConditionContext>
                      <Condition />
                    </ConditionContext>
                  }
                />
                <Route
                  exact
                  path="/signature"
                  element={
                    <SignatureContext>
                      <Signature />
                    </SignatureContext>
                  }
                />
                <Route
                  exact
                  path="/parametertype"
                  element={
                    <ParameterTypeContext>
                      <ParameterType />
                    </ParameterTypeContext>
                  }
                />
                <Route
                  exact
                  path="/parameter"
                  element={
                    <ParameterContext>
                      <Parameter />
                    </ParameterContext>
                  }
                />
                <Route
                  exact
                  path="/sample"
                  element={
                    <SampleContext>
                      <Sample />
                    </SampleContext>
                  }
                />
              </Routes>
            </Layout>
          </UserContext>
        )}
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default React.memo(App);
