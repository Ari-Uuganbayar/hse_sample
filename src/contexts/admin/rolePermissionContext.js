import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/admin/rolePermissionReducer";
import { notification } from "antd";
import _ from "lodash";

const _state = {
  role_loading: false,
  role_list: [],
  role_id: null,
  permission_loading: false,
  permission_list: [],
  refresh: 0,
};

const context = React.createContext();

export const useRolePermissionContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("context wrong");
  }
  return ctx;
};

const RolePermissionContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, _state);
  const [api, contextHolder] = notification.useNotification();

  const message = ({ type, error = null, title, description = null }) => {
    if (type === "error") {
      api.error({
        message: title,
        description:
          _.toString(error.toJSON().status) +
          " - " +
          (error?.response?.data?.message
            ? error?.response?.data?.message
            : error.toJSON().message),
        placement: "topRight",
        duration: 5,
      });
    }
    if (type === "info") {
      api.info({
        message: title,
        description: description,
        placement: "topRight",
        duration: 5,
      });
    }
    if (type === "success") {
      api.success({
        message: title,
        description: description,
        placement: "topRight",
        duration: 5,
      });
    }
    if (type === "warning") {
      api.warning({
        message: title,
        description: description,
        placement: "topRight",
        duration: 5,
      });
    }
  };

  return (
    <context.Provider
      value={{
        state,
        dispatch,
        message,
      }}
    >
      {contextHolder}
      {children}
    </context.Provider>
  );
};

export default React.memo(RolePermissionContext);
