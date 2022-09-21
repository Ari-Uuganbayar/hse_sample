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
    case "TYPE":
      return {
        ...state,
        type: action.data,
      };
    case "NAME":
      return {
        ...state,
        name: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
        type: null,
        name: null,
      };
    case "SET":
      return {
        ...state,
        id: action.data.permissionid,
        type: action.data.permissionconstantname,
        name: action.data.permissiontitle,
      };
    default:
      return state;
  }
};
