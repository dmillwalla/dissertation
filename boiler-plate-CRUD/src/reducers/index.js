import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import authReducer from "./authReducer";
import cityguideReducer from "./cityguideReducer";
import streamReducer from "./streamReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  streams: streamReducer,
  cityguide: cityguideReducer,
});
