import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/reference/organizationReducer";
import { notification } from "antd";

const _state = {
  list: [],
  refresh: 0,

  modal: false,
  id: null,
  list_parent: [],
  parentid: null,
  type: 1,
  name: null,
  description: null,
};

const context = React.createContext();

export const useOrganizationContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context error");
  }
  return ctx;
};

const OrganizationContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, _state);
  const [api, contextHolder] = notification.useNotification();

  const message = ({ type, error = null, title, description = null }) => {
    if (type === "error") {
      api.error({
        message: title,
        description:
          error.toJSON().status +
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

export default React.memo(OrganizationContext);
