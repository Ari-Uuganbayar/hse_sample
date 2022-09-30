import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/reference/parameterReducer";
import { notification } from "antd";

const _state = {
  list: [],
  refresh: 0,

  modal: false,
  id: null,
  listParameterType: [],
  parameterType: null,
  parameterName: null,
  parameterChar: null,
  standart: null,
  unit: null,
  maxValue8: null,
  maxValue12: null,
};

const context = React.createContext();

export const useParameterContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("useParameterTypeContext error");
  }
  return ctx;
};

const ParameterContext = ({ children }) => {
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

export default React.memo(ParameterContext);
