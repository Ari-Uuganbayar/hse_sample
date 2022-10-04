import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAppContext } from "src/contexts/appContext";
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

import "src/assets/css/tailwind.css";
import "antd/dist/antd.min.css";
import "moment/locale/mn";

// import Login from "src/pages/login";
import Layout from "src/components/layout";
import PageNotFound from "src/pages/_404";

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

const Router = () => {
  const { state } = useAppContext();

  return (
    <>
      <Routes>
        <Route exact path="/samplework/qr/:qr" element={<Result />} />
      </Routes>

      {state.loggedIn && (
        <Layout>
          <Routes>
            <Route path="/admin">
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
                path="permission"
                element={
                  <PermissionContext>
                    <Permission />
                  </PermissionContext>
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
                path="rolepermission"
                element={
                  <RolePermissionContext>
                    <RolePermission />
                  </RolePermissionContext>
                }
              />
              <Route
                exact
                path="rolemenu"
                element={
                  <RoleMenuContext>
                    <RoleMenu />
                  </RoleMenuContext>
                }
              />
              <Route
                exact
                path="user"
                element={
                  <UserContext>
                    <User />
                  </UserContext>
                }
              />
              <Route
                exact
                path="userrole"
                element={
                  <UserRoleContext>
                    <UserRole />
                  </UserRoleContext>
                }
              />
            </Route>

            <Route path="reference">
              <Route
                exact
                path="location"
                element={
                  <LocationContext>
                    <Location />
                  </LocationContext>
                }
              />

              <Route
                exact
                path="organization"
                element={
                  <OrganizationContext>
                    <Organization />
                  </OrganizationContext>
                }
              />
              <Route
                exact
                path="condition"
                element={
                  <ConditionContext>
                    <Condition />
                  </ConditionContext>
                }
              />
              <Route
                exact
                path="signature"
                element={
                  <SignatureContext>
                    <Signature />
                  </SignatureContext>
                }
              />
              <Route
                exact
                path="parametertype"
                element={
                  <ParameterTypeContext>
                    <ParameterType />
                  </ParameterTypeContext>
                }
              />
              <Route
                exact
                path="parameter"
                element={
                  <ParameterContext>
                    <Parameter />
                  </ParameterContext>
                }
              />
            </Route>

            <Route
              exact
              path="/sample"
              element={
                <SampleContext>
                  <Sample />
                </SampleContext>
              }
            />
            <Route path="*" exact={true} element={<PageNotFound />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

export default React.memo(Router);
