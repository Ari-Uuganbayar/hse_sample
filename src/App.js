import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "src/lib/protectedRoute";

import AppContext from "src/contexts/appContext";
import MenuContext from "src/contexts/admin/menuContext";
import PermissionContext from "src/contexts/admin/permissionContext";
import RoleContext from "src/contexts/admin/roleContext";
import RolePermissionContext from "src/contexts/admin/rolePermissionContext";
import RoleMenuContext from "src/contexts/admin/roleMenuContext";
import UserContext from "src/contexts/admin/userContext";
import UserRoleContext from "src/contexts/admin/userRoleContext";

import LocationContext from "src/contexts/reference/locationContext";
import OrganizationContext from "src/contexts/reference/organizationContext";
import ConditionContext from "src/contexts/reference/conditionContext";
import SignatureContext from "src/contexts/reference/signatureContext";
import ParameterTypeContext from "src/contexts/reference/parameterTypeContext";
import ParameterContext from "src/contexts/reference/parameterContext";
import SampleContext from "src/contexts/sampleContext";

import Login from "src/pages/login";
import PageNotFound from "src/pages/_404";
import Layout from "src/components/layout";

// Admin
import Menu from "src/pages/admin/menu";
import Permission from "src/pages/admin/permission";
import Role from "src/pages/admin/role";
import RolePermission from "src/pages/admin/rolePermission";
import RoleMenu from "src/pages/admin/roleMenu";
import User from "src/pages/admin/user";
import UserRole from "src/pages/admin/userRole";

// Reference
import Location from "src/pages/reference/location";
import Organization from "src/pages/reference/organization";
import Condition from "src/pages/reference/condition";
import Signature from "src/pages/reference/signature";
import ParameterType from "src/pages/reference/parameterType";
import Parameter from "src/pages/reference/parameter";

import Sample from "src/pages/sample";
import Result from "src/pages/result";

import "src/assets/css/tailwind.css";
import "antd/dist/antd.min.css";
import { ConfigProvider } from "antd";
import mn from "antd/lib/locale/mn_MN";
import "moment/locale/mn";

function App() {
  return (
    <ConfigProvider locale={mn}>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/samplework/qr/:qr" element={<Result />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/admin">
              <Route
                exact
                path="menu"
                element={
                  <AppContext>
                    <Layout>
                      <MenuContext>
                        <Menu />
                      </MenuContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="permission"
                element={
                  <AppContext>
                    <Layout>
                      <PermissionContext>
                        <Permission />
                      </PermissionContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="role"
                element={
                  <AppContext>
                    <Layout>
                      <RoleContext>
                        <Role />
                      </RoleContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="rolepermission"
                element={
                  <AppContext>
                    <Layout>
                      <RolePermissionContext>
                        <RolePermission />
                      </RolePermissionContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="rolemenu"
                element={
                  <AppContext>
                    <Layout>
                      <RoleMenuContext>
                        <RoleMenu />
                      </RoleMenuContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="user"
                element={
                  <AppContext>
                    <Layout>
                      <UserContext>
                        <User />
                      </UserContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="userrole"
                element={
                  <AppContext>
                    <Layout>
                      <UserRoleContext>
                        <UserRole />
                      </UserRoleContext>
                    </Layout>
                  </AppContext>
                }
              />
            </Route>

            <Route path="reference">
              <Route
                exact
                path="location"
                element={
                  <AppContext>
                    <Layout>
                      <LocationContext>
                        <Location />
                      </LocationContext>
                    </Layout>
                  </AppContext>
                }
              />

              <Route
                exact
                path="organization"
                element={
                  <AppContext>
                    <Layout>
                      <OrganizationContext>
                        <Organization />
                      </OrganizationContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="condition"
                element={
                  <AppContext>
                    <Layout>
                      <ConditionContext>
                        <Condition />
                      </ConditionContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="signature"
                element={
                  <AppContext>
                    <Layout>
                      <SignatureContext>
                        <Signature />
                      </SignatureContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="parametertype"
                element={
                  <AppContext>
                    <Layout>
                      <ParameterTypeContext>
                        <ParameterType />
                      </ParameterTypeContext>
                    </Layout>
                  </AppContext>
                }
              />
              <Route
                exact
                path="parameter"
                element={
                  <AppContext>
                    <Layout>
                      <ParameterContext>
                        <Parameter />
                      </ParameterContext>
                    </Layout>
                  </AppContext>
                }
              />
            </Route>

            <Route
              exact
              path="/sample"
              element={
                <AppContext>
                  <Layout>
                    <SampleContext>
                      <Sample />
                    </SampleContext>
                  </Layout>
                </AppContext>
              }
            />
          </Route>
          <Route path="*" exact={true} element={<PageNotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default React.memo(App);
