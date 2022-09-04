import React, { useEffect, useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/userReducer";
import * as api from "src/api/request";
import Swal from "sweetalert2";

const _state = {
  tn: 0,
  info: {},
  userdeps: [],
  usergroup: "",
  userGroupList: [],
  usermenu: [],
  userzone: [],
  loggedIn: false,

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
  const [state, dispatch] = useReducer(reducer, _state);

  useEffect(() => {
    if (navigator.onLine) {
      var token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token === null) {
        api
          .API()
          .get(`/auth`)
          .then((res) => {
            const result = res.data;
            let url = result.url;
            if (window.location.hostname === "localhost") {
              url = url.replace(
                "https://safetyjob.erdenetmc.mn/callback",
                "http://localhost:3000/callback"
              );
            }
            window.location.replace(url);
          });
      } else {
        if (state.tn === 0) {
          api.getUserInfo().then((res) => {
            dispatch({
              type: type.LOG_IN,
              data: res,
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
  }, [state.tn]);

  useEffect(() => {
    var menu1 = localStorage.getItem("menu1");
    if (menu1 === null || menu1 === undefined || menu1 === "") menu1 = null;
    dispatch({
      type: type.CHANGE_TEMPLATE_MENU1,
      data: menu1 === null ? _state.template.menu1 : parseInt(menu1),
    });
    var menu2 = localStorage.getItem("menu2");
    if (menu2 === null || menu2 === undefined || menu2 === "") menu2 = null;
    dispatch({
      type: type.CHANGE_TEMPLATE_MENU2,
      data: menu2 === null ? _state.template.menu2 : parseInt(menu2),
    });
  }, []);

  return (
    <context.Provider
      value={{
        user: state,
        userDispatch: dispatch,
        userType: type,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default React.memo(UserContext);
