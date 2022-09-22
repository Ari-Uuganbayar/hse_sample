import React, { useEffect, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { reducer } from "src/reducers/userReducer";
import * as API from "src/api/request";
import { notification } from "antd";
import Swal from "sweetalert2";

const _state = {
  usermenu: [],
  loggedIn: false,
  list_menu: [],

  template: {
    mode: "light",
    sidebar: true,
    menu1: 1869,
    menu2: 0,
  },
};

const context = React.createContext();

export const useUserContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("UserContext wrong");
  }
  return ctx;
};

const UserContext = ({ children }) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (navigator.onLine) {
      var token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        navigate("/login");
      } else {
        if (!state.loggedIn) {
          API.getUserInfo()
            .then((res) => {
              dispatch({
                type: "LOG_IN",
                data: res,
              });
            })
            .catch((error) => {
              message({
                type: "error",
                error,
                title: "Хэрэглэгчийн мэдээлэл татаж чадсангүй",
              });
            });
          API.getUserMenu()
            .then((menu) => {
              dispatch({ type: "LIST_MENU", data: menu });
            })
            .catch((error) => {
              message({
                type: "error",
                error,
                title: "Хэрэглэгчийн цэс татаж чадсангүй",
              });
            });
        }
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Интернэт холболтоо шалгана уу.",
        html: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tn]);

  useEffect(() => {
    var menu1 = localStorage.getItem("menu1");
    if (menu1 === null || menu1 === undefined || menu1 === "") menu1 = null;
    dispatch({
      type: "MENU1",
      data: menu1 === null ? _state.template.menu1 : parseInt(menu1),
    });
    var menu2 = localStorage.getItem("menu2");
    if (menu2 === null || menu2 === undefined || menu2 === "") menu2 = null;
    dispatch({
      type: "MENU2",
      data: menu2 === null ? _state.template.menu2 : parseInt(menu2),
    });
  }, []);

  return (
    <context.Provider
      value={{
        user: state,
        userDispatch: dispatch,
      }}
    >
      {contextHolder}
      {children}
    </context.Provider>
  );
};

export default React.memo(UserContext);
