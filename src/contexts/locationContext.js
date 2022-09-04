import React, { useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/locationReducer";

const _state = {
  listOrgType: [
    { id: 1, text: "Эрдэнэт үйлдвэр" },
    { id: 2, text: "Гадны байгууллага" },
  ],
  selectedOrgType: 1,
  listLocation: [],
  refresh: 0,

  detail: {
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

const context = React.createContext();

export const useLocationContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context error");
  }
  return ctx;
};

const LocationContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, _state);

  return (
    <context.Provider
      value={{
        state,
        dispatch,
        type,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default React.memo(LocationContext);
