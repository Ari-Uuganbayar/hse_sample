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
    case "TYPE":
      return {
        ...state,
        type: action.data,
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
    case "DESCRIPTION":
      return {
        ...state,
        description: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
        parentid: null,
        type: 1,
        name: null,
        description: null,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
        parentid: action.data.parentid,
        type: action.data.rorganizationtypeid,
        name: action.data.organizationname,
        description: action.data.description,
      };

    default:
      return state;
  }
};
