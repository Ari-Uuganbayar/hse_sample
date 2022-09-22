export const reducer = (state, action) => {
  switch (action.type) {
    case "ORGTYPE":
      return {
        ...state,
        orgtype: action.data,
      };
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
    case "LIST_ORGANIZATION":
      return {
        ...state,
        list_organization: action.data,
      };
    case "ORGANIZATION":
      return {
        ...state,
        organization: action.data,
      };
    case "CODE":
      return {
        ...state,
        code: action.data,
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
        type: 1,
        organization: null,
        code: null,
        name: null,
        description: null,
      };
    case "SET":
      return {
        ...state,
        id: action.data.id,
        organization: action.data.organizationid,
        code: action.data.locationcode,
        name: action.data.locationname,
        description: action.data.description,
      };

    case "QR_MODAL":
      return {
        ...state,
        qr_modal: action.data,
      };
    case "QR_PARENT":
      return {
        ...state,
        qr_parent: action.data,
      };
    case "QR_ORGANIZATION":
      return {
        ...state,
        qr_organization: action.data,
      };
    case "QR_LOCATION":
      return {
        ...state,
        qr_location: action.data,
      };
    case "QR_VALUE":
      return {
        ...state,
        qr_value: action.data,
      };

    default:
      return state;
  }
};
