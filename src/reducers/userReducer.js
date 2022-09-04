export const type = {
  LOG_IN: "LOG_IN",
  LOG_OUT: "LOG_OUT",
  CHANGE_TEMPLATE_SIDEBAR: "CHANGE_TEMPLATE_SIDEBAR",
  CHANGE_TEMPLATE_MENU1: "CHANGE_TEMPLATE_MENU1",
  CHANGE_TEMPLATE_MENU2: "CHANGE_TEMPLATE_MENU2",
};

const _ = require("lodash");

export const reducer = (state, action) => {
  switch (action.type) {
    case type.LOG_IN:
      var userGroupList = _.split(action.data.usergroup, ",").map((a) => +a);
      return {
        ...state,
        ...action.data,
        userGroupList,
        loggedIn: true,
      };

    case type.LOG_OUT:
      localStorage.removeItem("token");
      localStorage.removeItem("menu1");
      localStorage.removeItem("menu2");
      return { ...state, loggedIn: false };

    case type.CHANGE_TEMPLATE_SIDEBAR:
      return {
        ...state,
        template: {
          ...state.template,
          sidebar: !state.template.sidebar,
        },
      };

    case type.CHANGE_TEMPLATE_MENU1:
      localStorage.setItem("menu1", action.data);
      return {
        ...state,
        template: {
          ...state.template,
          menu1: action.data,
        },
      };

    case type.CHANGE_TEMPLATE_MENU2:
      localStorage.setItem("menu2", action.data);
      return {
        ...state,
        template: {
          ...state.template,
          menu2: action.data,
        },
      };

    default:
      return state;
  }
};
