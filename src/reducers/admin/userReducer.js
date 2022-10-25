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
    case "LIST_ROLE":
      return {
        ...state,
        list_role: action.data,
      };
    case "MODAL":
      return {
        ...state,
        modal: action.data,
      };
    case "ID":
      return {
        ...state,
        id: action.data,
      };
    case "TN":
      return {
        ...state,
        tn: action.data,
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
    case "ROLE":
      return {
        ...state,
        role: action.data,
      };
    case "ISADMIN":
      return {
        ...state,
        isadmin: action.data,
      };
    case "ISACTIVE":
      return {
        ...state,
        isactive: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
        tn: null,
        username: null,
        shortname: null,
        password: null,
        role: [],
        isactive: true,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
        tn: action.data.tn,
        username: action.data.username,
        shortname: action.data.shortname,
        password: null,
        role: action.data.roles,
        isactive: action.data.isactive,
      };

    case "PASSWORD_MODAL":
      return {
        ...state,
        password_modal: action.data,
      };
    case "PASSWORD_NEW":
      return {
        ...state,
        password_new: action.data,
      };
    default:
      return state;
  }
};
