export const type = {
  CHANGE_LIST: "CHANGE_LIST",
  CHANGE_REFRESH: "CHANGE_REFRESH",

  CLEAR_DETAIL: "CLEAR_DETAIL",
  SET_DETAIL: "SET_DETAIL",
  CHANGE_DETAIL_MODAL: "CHANGE_DETAIL_MODAL",
  CHANGE_DETAIL_ID: "CHANGE_DETAIL_ID",
  CHANGE_DETAIL_NAME: "CHANGE_DETAIL_NAME",
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
          name: null,
        },
      };

    case type.SET_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          id: action.data.id,
          name: action.data.conditionname,
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

    case type.CHANGE_DETAIL_NAME:
      return {
        ...state,
        detail: { ...state.detail, name: action.data },
      };

    default:
      return state;
  }
};
