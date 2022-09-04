import React, { useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/sampleReducer";

const _state = {
  list: [],
  listParameter: [],
  refresh: 0,

  detail: {
    modal: false,
    id: null,
    name: null,
  },
};

const context = React.createContext();

export const useSampleContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context error");
  }
  return ctx;
};

const SampleContext = ({ children }) => {
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

export default React.memo(SampleContext);
