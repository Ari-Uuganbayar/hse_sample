import React, { useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/parameterTypeReducer";

const _state = {
  list: [],
  refresh: 0,

  detail: {
    modal: false,
    id: null,
    name: null,
  },
};

const context = React.createContext();

export const useParameterTypeContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("useParameterTypeContext error");
  }
  return ctx;
};

const ParameterTypeContext = ({ children }) => {
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

export default React.memo(ParameterTypeContext);
