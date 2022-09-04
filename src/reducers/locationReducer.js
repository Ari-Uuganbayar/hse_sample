export const type = {
  CHANGE_SELECTED_ORG_TYPE: "CHANGE_SELECTED_ORG_TYPE",
  CHANGE_LIST_LOCATION: "CHANGE_LIST_LOCATION",
  CHANGE_REFRESH: "CHANGE_REFRESH",

  CLEAR_DETAIL: "CLEAR_DETAIL",
  CHANGE_DETAL: "CHANGE_DETAL",
  CHANGE_DETAIL_SELECTED_ORG_TYPE: "CHANGE_DETAIL_SELECTED_ORG_TYPE",
  CHANGE_DETAIL_LIST_ORGANIZATION: "CHANGE_DETAIL_LIST_ORGANIZATION",
  CHANGE_DETAIL_SELECTED_ORGANIZATION: "CHANGE_DETAIL_SELECTED_ORGANIZATION",
  CHANGE_DETAIL_LIST_TSEH: "CHANGE_DETAIL_LIST_TSEH",
  CHANGE_DETAIL_SELECTED_TSEH: "CHANGE_DETAIL_SELECTED_TSEH",
  CHANGE_DETAIL_LIST_NEGJ: "CHANGE_DETAIL_LIST_NEGJ",
  CHANGE_DETAIL_SELECTED_NEGJ: "CHANGE_DETAIL_SELECTED_NEGJ",
  CHANGE_DETAIL_LOCATION_CODE: "CHANGE_DETAIL_LOCATION_CODE",
  CHANGE_DETAIL_LOCATION_NAME: "CHANGE_DETAIL_LOCATION_NAME",
  CHANGE_DETAIL_DESCRIPTION: "CHANGE_DETAIL_DESCRIPTION",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case type.CHANGE_SELECTED_ORG_TYPE:
      return {
        ...state,
        selectedOrgType: action.data,
      };

    case type.CHANGE_LIST_LOCATION:
      return {
        ...state,
        listLocation: action.data,
      };

    case type.CHANGE_REFRESH:
      return {
        ...state,
        refresh: state.refresh + 1,
      };

    case type.CHANGE_DETAIL_SELECTED_ORG_TYPE:
      return {
        ...state,
        detail: {
          ...state.detail,
          selectedOrgType: action.data,
        },
      };

    case type.CHANGE_DETAIL_LIST_ORGANIZATION:
      return {
        ...state,
        detail: {
          ...state.detail,
          listOrganization: action.data,
        },
      };

    case type.CHANGE_DETAIL_SELECTED_ORGANIZATION:
      return {
        ...state,
        detail: {
          ...state.detail,
          selectedOrganization: action.data,
        },
      };

    case type.CHANGE_DETAIL_LIST_TSEH:
      return {
        ...state,
        detail: {
          ...state.detail,
          listTseh: action.data,
        },
      };

    case type.CHANGE_DETAIL_SELECTED_TSEH:
      return {
        ...state,
        detail: {
          ...state.detail,
          selectedTseh: action.data,
        },
      };

    case type.CHANGE_DETAIL_LIST_NEGJ:
      return {
        ...state,
        detail: {
          ...state.detail,
          listNegj: action.data,
        },
      };

    case type.CHANGE_DETAIL_SELECTED_NEGJ:
      return {
        ...state,
        detail: {
          ...state.detail,
          selectedNegj: action.data,
        },
      };

    case type.CHANGE_DETAIL_LOCATION_CODE:
      return {
        ...state,
        detail: {
          ...state.detail,
          locationCode: action.data,
        },
      };

    case type.CHANGE_DETAIL_LOCATION_NAME:
      return {
        ...state,
        detail: {
          ...state.detail,
          locationName: action.data,
        },
      };

    case type.CHANGE_DETAIL_DESCRIPTION:
      return {
        ...state,
        detail: {
          ...state.detail,
          description: action.data,
        },
      };

    case type.CLEAR_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          selectedOrgType: 1,
          listOrganization: [],
          selectedOrganization: null,
          listTseh: [],
          selectedTseh: null,
          listNegj: [],
          selectedNegj: null,
          locationCode: null,
          locationName: null,
          description: null,
        },
      };

    case type.CHANGE_DETAL:
      return {
        ...state,
        detail: {
          ...state.detail,
          selectedOrgType: action.data.rorganizationtypeid,
          selectedOrganization: action.data.organizationid,
          selectedTseh: action.data.tsehcode,
          selectedNegj: action.data.negjcode,
          locationCode: action.data.locationcode,
          locationName: action.data.locationname,
          description: action.data.description,
        },
      };

    default:
      return state;
  }
};
