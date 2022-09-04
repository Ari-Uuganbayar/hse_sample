import React, { useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/parameterReducer";

const _state = {
  list: [],
  refresh: 0,

  detail: {
    modal: false,
    id: null,
    listParameterType: [],
    parameterType: null,
    parameterName: null,
    parameterChar: null,
    standart: null,
    unit: null,
    maxValue8: null,
    maxValue12: null,
  },
};

const context = React.createContext();

export const useParameterContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("useParameterTypeContext error");
  }
  return ctx;
};

const ParameterContext = ({ children }) => {
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

export default React.memo(ParameterContext);
