export const reducer = (state, action) => {
  switch (action.type) {
    case "LIST":
      return {
        ...state,
        list: action.data,
      };
    case "LIST_PARENT":
      return {
        ...state,
        list_parent: action.data,
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
    case "PARENT":
      return {
        ...state,
        parentid: action.data,
      };
    case "NAME":
      return {
        ...state,
        name: action.data,
      };
    case "ROUTE":
      return {
        ...state,
        route: action.data,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
        parentid: action.data.parentid === 0 ? null : action.data.parentid,
        name: action.data.menuname,
        route: action.data.route,
        isactive: action.data.isactive,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
        parentid: null,
        name: null,
        route: null,
        isactive: 1,
      };
    default:
      return state;
  }
};
