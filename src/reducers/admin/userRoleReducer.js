export const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADING":
      return {
        ...state,
        user_loading: action.data,
      };
    case "USER_LIST":
      return {
        ...state,
        user_list: action.data,
        user_id: action.data.length > 0 ? action.data[0].id : null,
      };
    case "USER_ID":
      return {
        ...state,
        user_id: action.data,
      };
    case "ROLE_LOADING":
      return {
        ...state,
        role_loading: action.data,
      };
    case "ROLE_LIST":
      return {
        ...state,
        role_list: action.data,
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
