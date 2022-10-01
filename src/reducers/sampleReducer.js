export const reducer = (state, action) => {
  switch (action.type) {
    case "LIST":
      return {
        ...state,
        list: action.data,
      };
    case "LIST_PARAMETER":
      return {
        ...state,
        list_parameter: action.data,
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
    case "ID":
      return {
        ...state,
        id: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
      };

    default:
      return state;
  }
};
