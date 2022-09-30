export const reducer = (state, action) => {
  switch (action.type) {
    case "LIST":
      return {
        ...state,
        list: action.data,
      };
    case "REFRESH":
      return {
        ...state,
        refresh: state.refresh + 1,
      };
    case "MODAL":
      return {
        ...state,
        modal: action.data,
      };
    case "USERNAME":
      return {
        ...state,
        username: action.data,
      };
    case "SHORTNAME":
      return {
        ...state,
        shortname: action.data,
      };
    case "PASSWORD":
      return {
        ...state,
        password: action.data,
      };
    case "ISADMIN":
      return {
        ...state,
        isadmin: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
        username: null,
        shortname: null,
        password: null,
        isadmin: false,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
        username: action.data.username,
        shortname: action.data.shortname,
        password: null,
        isadmin: false,
      };
    default:
      return state;
  }
};
