export const reducer = (state, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        ...action.data,
        loggedIn: true,
      };

    case "LOG_OUT":
      window.localStorage.clear();
      return { ...state, loggedIn: false };

    case "LIST_MENU":
      return { ...state, list_menu: action.data };

    case "SIDEBAR":
      return {
        ...state,
        template: {
          ...state.template,
          sidebar: !state.template.sidebar,
        },
      };

    case "MENU1":
      localStorage.setItem("menu1", action.data);
      return {
        ...state,
        template: {
          ...state.template,
          menu1: action.data,
        },
      };

    case "MENU2":
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
