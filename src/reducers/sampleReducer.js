import moment from "moment";

export const reducer = (state, action) => {
  switch (action.type) {
    case "DATES":
      return {
        ...state,
        begindate: action.data[0],
        enddate: action.data[1],
      };
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
    case "LIST_ORGANIZATION":
      return {
        ...state,
        list_organization: action.data,
      };
    case "LIST_LOCATION":
      return {
        ...state,
        list_location: action.data,
      };
    case "LIST_CONDITION":
      return {
        ...state,
        list_condition: action.data,
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
    case "ORGANIZATION_TYPE":
      return {
        ...state,
        organization_type: action.data,
      };
    case "ORGANIZATION":
      return {
        ...state,
        organization: action.data,
        location: null,
      };
    case "LOCATION":
      return {
        ...state,
        location: action.data,
      };
    case "CONDITION":
      return {
        ...state,
        condition: action.data,
      };
    case "DATE":
      return {
        ...state,
        date: action.data,
      };
    case "CLEAR":
      return {
        ...state,
        organization_type: 1,
        organization: null,
        condition: null,
        date: moment(),
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
