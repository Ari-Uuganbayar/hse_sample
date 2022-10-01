export const reducer = (state, action) => {
  switch (action.type) {
    case "ROLE_LOADING":
      return {
        ...state,
        role_loading: action.data,
      };
    case "ROLE_LIST":
      return {
        ...state,
        role_list: action.data,
        role_id: action.data.length > 0 ? action.data[0].roleid : null,
      };
    case "ROLE_ID":
      return {
        ...state,
        role_id: action.data,
      };
    case "MENU_LOADING":
      return {
        ...state,
        menu_loading: action.data,
      };
    case "MENU_LIST":
      return {
        ...state,
        menu_list: action.data,
      };
    case "REFRESH":
      return {
        ...state,
        refresh: state.refresh + 1,
      };
    default:
      return state;
  }
};
