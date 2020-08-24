import React, { createContext, useReducer } from "react";

export const PkmnContext = createContext();

const initialState = {
  id: 1,
  isLoading: false,
  pkmn: null,
  show: false
};

export const actionTypes = {
  SET_ID: "SET_ID",
  SET_LOADING: "SET_LOADING",
  START_LOADING: "START_LOADING",
  END_LOADING: "END_LOADING",
  SET_PKMN: "SET_PKMN",
  SHOW_INFO: "SHOW_INFO",
  SET_RANDOM_ID: "SET_RANDOM_ID",
  SET_ID_UP: "SET_ID_UP",
  SET_ID_DOWN: "SET_ID_DOWN"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_ID: {
      switch (action.payload) {
        case "random":
          return {
            ...state,
            id: Math.floor(Math.random() * 800)
          };
        case "up":
          return {
            ...state,
            id: state.id < 800 ? state.id + 1 : state.id
          };
        case "down":
          return {
            ...state,
            id: state.id > 1 ? state.id - 1 : state.id
          };
        default:
          throw new Error();
      }
    }
    case actionTypes.START_LOADING:
      return {
        ...state,
        isLoading: true,
        show: false
      };
    case actionTypes.END_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case actionTypes.SET_PKMN:
      return {
        ...state,
        pkmn: action.payload,
        isLoading: false
      };
    case actionTypes.SHOW_INFO:
      return {
        ...state,
        show: true
      };
    default:
      throw new Error();
  }
};

export const PkmnProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PkmnContext.Provider value={[state, dispatch]}>
      {children}
    </PkmnContext.Provider>
  );
};
