import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/sampleReducer";
import { notification } from "antd";
import moment from "moment";

const _state = {
  begindate: moment().startOf("year"),
  enddate: moment().endOf("year"),
  list: [],
  list_parameter: [],
  refresh: 0,

  list_organization_type: [
    { id: 1, text: "Эрдэнэт үйлдвэр" },
    { id: 2, text: "Гадны байгууллага" },
  ],
  list_organization: [],
  list_location: [],
  list_condition: [],
  modal: false,
  id: null,
  organization_type: 1,
  organization: null,
  condition: null,
  date: moment(),

  result_modal: false,
  result_id: null,
  result_list: [],
};

const context = React.createContext();

export const useSampleContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context error");
  }
  return ctx;
};

const SampleContext = ({ children }) => {
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

export default React.memo(SampleContext);
