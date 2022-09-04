import React, { useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/organizationReducer";

const _state = {
  list: [],
  refresh: 0,

  detail: {
    modal: false,
    id: null,
    organizationName: null,
    description: null,
  },
};

const context = React.createContext();

export const useOrganizationContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context error");
  }
  return ctx;
};

const OrganizationContext = ({ children }) => {
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

export default React.memo(OrganizationContext);
