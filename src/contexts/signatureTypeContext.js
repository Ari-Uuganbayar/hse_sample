import React, { useContext, useReducer } from "react";
import { reducer, type } from "src/reducers/signatureTypeReducer";

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

export const useSignatureTypeContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context error");
  }
  return ctx;
};

const SignatureTypeContext = ({ children }) => {
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

export default React.memo(SignatureTypeContext);
