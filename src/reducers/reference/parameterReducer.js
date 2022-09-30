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
    case "LIST_TYPE":
      return {
        ...state,
        list_type: action.data,
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
    case "CHAR":
      return {
        ...state,
        char: action.data,
      };
    case "STANDART":
      return {
        ...state,
        standart: action.data,
      };
    case "UNIT":
      return {
        ...state,
        unit: action.data,
      };
    case "VALUE8":
      return {
        ...state,
        value8: action.data,
      };
    case "VALUE12":
      return {
        ...state,
        value12: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        id: null,
        type: null,
        name: null,
        char: null,
        standart: null,
        unit: null,
        value8: null,
        value12: null,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
        type: action.data.rparametertypeid,
        name: action.data.parametername,
        char: action.data.parameterchar,
        standart: action.data.standart,
        unit: action.data.unitname,
        value8: action.data.maxvalue8,
        value12: action.data.maxvalue12,
      };

    default:
      return state;
  }
};
