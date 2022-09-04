export const type = {
  CHANGE_LIST: "CHANGE_LIST",
  CHANGE_REFRESH: "CHANGE_REFRESH",

  CLEAR_DETAIL: "CLEAR_DETAIL",
  SET_DETAIL: "SET_DETAIL",
  CHANGE_DETAIL_MODAL: "CHANGE_DETAIL_MODAL",
  CHANGE_DETAIL_ID: "CHANGE_DETAIL_ID",
  CHANGE_DETAIL_ORGANIZATION_NAME: "CHANGE_DETAIL_ORGANIZATION_NAME",
  CHANGE_DETAIL_DESCRIPTION: "CHANGE_DETAIL_DESCRIPTION",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case type.CHANGE_LIST:
      return {
        ...state,
        list: action.data,
      };

    case type.CHANGE_REFRESH:
      return {
        ...state,
        refresh: state.refresh + 1,
      };

    case type.CLEAR_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          id: null,
          organizationName: null,
          description: null,
        },
      };

    case type.SET_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          id: action.data.id,
          organizationName: action.data.organizationname,
          description: action.data.description,
        },
      };

    case type.CHANGE_DETAIL_MODAL:
      return {
        ...state,
        detail: { ...state.detail, modal: action.data },
      };

    case type.CHANGE_DETAIL_ID:
      return {
        ...state,
        detail: { ...state.detail, id: action.data },
      };

    case type.CHANGE_DETAIL_ORGANIZATION_NAME:
      return {
        ...state,
        detail: { ...state.detail, organizationName: action.data },
      };

    case type.CHANGE_DETAIL_DESCRIPTION:
      return {
        ...state,
        detail: { ...state.detail, description: action.data },
      };

    default:
      return state;
  }
};
