import _ from "lodash";

import {
  ADD_PREFERENCE,
  GET_PREFERENCE,
  DELETE_PREFERENCE,
  GET_RECOMMENDATIONS,
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_PREFERENCE:
      return { ...state, preferences: [...state.preferences, action.payload] };
    case GET_PREFERENCE:
      return { ...state, preferences: [...action.payload] };
    case DELETE_PREFERENCE:
      return {
        ...state,
        preferences: _.without(state.preferences, action.payload),
      };
    case GET_RECOMMENDATIONS:
      console.log("Inside GET_RECOMMENDATIONS", action.payload);
      return { ...state, recommendations: action.payload };
    default:
      return state;
  }
};
