import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/admin/menuReducer";
import { notification } from "antd";
import _ from "lodash";

const _state = {
  list: [],
  refresh: 0,
  modal: false,
  id: null,
  list_parent: [],
  parentid: null,
  name: null,
  route: null,
  isactive: 1,
};

const context = React.createContext();

export const useMenuContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("context wrong");
  }
  return ctx;
};

const MenuContext = ({ children }) => {
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

export default React.memo(MenuContext);
