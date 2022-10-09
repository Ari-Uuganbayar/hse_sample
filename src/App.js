import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
      <AppContext>
        <Router>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/samplework/qr/:qr" element={<Result />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route exact path="/" element={<Navigate to="/sample" />} />
              <Route path="/admin">
                <Route
                  exact
                  path="menu"
                  element={
                    <Layout>
                      <MenuContext>
                        <Menu />
                      </MenuContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="permission"
                  element={
                    <Layout>
                      <PermissionContext>
                        <Permission />
                      </PermissionContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="role"
                  element={
                    <Layout>
                      <RoleContext>
                        <Role />
                      </RoleContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="rolepermission"
                  element={
                    <Layout>
                      <RolePermissionContext>
                        <RolePermission />
                      </RolePermissionContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="rolemenu"
                  element={
                    <Layout>
                      <RoleMenuContext>
                        <RoleMenu />
                      </RoleMenuContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="user"
                  element={
                    <Layout>
                      <UserContext>
                        <User />
                      </UserContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="userrole"
                  element={
                    <Layout>
                      <UserRoleContext>
                        <UserRole />
                      </UserRoleContext>
                    </Layout>
                  }
                />
              </Route>

              <Route path="reference">
                <Route
                  exact
                  path="location"
                  element={
                    <Layout>
                      <LocationContext>
                        <Location />
                      </LocationContext>
                    </Layout>
                  }
                />

                <Route
                  exact
                  path="organization"
                  element={
                    <Layout>
                      <OrganizationContext>
                        <Organization />
                      </OrganizationContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="condition"
                  element={
                    <Layout>
                      <ConditionContext>
                        <Condition />
                      </ConditionContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="signature"
                  element={
                    <Layout>
                      <SignatureContext>
                        <Signature />
                      </SignatureContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="parametertype"
                  element={
                    <Layout>
                      <ParameterTypeContext>
                        <ParameterType />
                      </ParameterTypeContext>
                    </Layout>
                  }
                />
                <Route
                  exact
                  path="parameter"
                  element={
                    <Layout>
                      <ParameterContext>
                        <Parameter />
                      </ParameterContext>
                    </Layout>
                  }
                />
              </Route>

              <Route
                exact
                path="/sample"
                element={
                  <Layout>
                    <SampleContext>
                      <Sample />
                    </SampleContext>
                  </Layout>
                }
              />
            </Route>
            <Route path="*" exact={true} element={<PageNotFound />} />
          </Routes>
        </Router>
      </AppContext>
    </ConfigProvider>
  );
}

export default React.memo(App);
