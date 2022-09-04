export const type = {
  CHANGE_LIST: "CHANGE_LIST",
  CHANGE_REFRESH: "CHANGE_REFRESH",

  CLEAR_DETAIL: "CLEAR_DETAIL",
  SET_DETAIL: "SET_DETAIL",
  CHANGE_DETAIL_MODAL: "CHANGE_DETAIL_MODAL",
  CHANGE_DETAIL_ID: "CHANGE_DETAIL_ID",
  CHANGE_DETAIL_LIST_PARAMETER_TYPE: "CHANGE_DETAIL_LIST_PARAMETER_TYPE",
  CHANGE_DETAIL_PARAMETER_TYPE: "CHANGE_DETAIL_PARAMETER_TYPE",
  CHANGE_DETAIL_PARAMETER_NAME: "CHANGE_DETAIL_PARAMETER_NAME",
  CHANGE_DETAIL_STANDART: "CHANGE_DETAIL_STANDART",
  CHANGE_DETAIL_UNIT: "CHANGE_DETAIL_UNIT",
  CHANGE_DETAIL_MAX_VALUE8: "CHANGE_DETAIL_MAX_VALUE8",
  CHANGE_DETAIL_MAX_VALUE12: "CHANGE_DETAIL_MAX_VALUE12",
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
          parameterType: null,
          parameterName: null,
          parameterChar: null,
          standart: null,
          unit: null,
          maxValue8: null,
          maxValue12: null,
        },
      };

    case type.SET_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          id: action.data.id,
          parameterType: action.data.rparametertypeid,
          parameterName: action.data.parametername,
          parameterChar: action.data.parameterchar,
          standart: action.data.standart,
          unit: action.data.unitname,
          maxValue8: action.data.maxvalue8,
          maxValue12: action.data.maxvalue12,
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

    case type.CHANGE_DETAIL_LIST_PARAMETER_TYPE:
      return {
        ...state,
        detail: { ...state.detail, listParameterType: action.data },
      };

    case type.CHANGE_DETAIL_PARAMETER_TYPE:
      return {
        ...state,
        detail: { ...state.detail, parameterType: action.data },
      };

    case type.CHANGE_DETAIL_PARAMETER_NAME:
      return {
        ...state,
        detail: { ...state.detail, parameterName: action.data },
      };

    case type.CHANGE_DETAIL_PARAMETER_CHAR:
      return {
        ...state,
        detail: { ...state.detail, parameterChar: action.data },
      };

    case type.CHANGE_DETAIL_STANDART:
      return {
        ...state,
        detail: { ...state.detail, standart: action.data },
      };

    case type.CHANGE_DETAIL_UNIT:
      return {
        ...state,
        detail: { ...state.detail, unit: action.data },
      };

    case type.CHANGE_DETAIL_MAX_VALUE8:
      return {
        ...state,
        detail: { ...state.detail, maxValue8: action.data },
      };

    case type.CHANGE_DETAIL_MAX_VALUE12:
      return {
        ...state,
        detail: { ...state.detail, maxValue12: action.data },
      };

    default:
      return state;
  }
};
