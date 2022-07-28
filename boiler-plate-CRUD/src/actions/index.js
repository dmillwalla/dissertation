import streams from "../apis/streams";
import cityguide from "../apis/cityguide";
import history from "../history";

import {
  SIGN_IN,
  SIGN_OUT,
  CREATE_STREAM,
  FETCH_STREAMS,
  FETCH_STREAM,
  DELETE_STREAM,
  EDIT_STREAM,
  GET_RECOMMENDATIONS,
  ADD_PREFERENCE,
  GET_PREFERENCE,
  DELETE_PREFERENCE,
} from "./types";

export const signIn = (userId) => {
  return {
    type: SIGN_IN,
    payload: userId,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const createStream = (formValues) => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await streams.post("/streams", { ...formValues, userId });

  dispatch({ type: CREATE_STREAM, payload: response.data });
  history.push("/");
};

export const fetchStreams = () => async (dispatch) => {
  const response = await streams.get("/streams");
  dispatch({ type: FETCH_STREAMS, payload: response.data });
};

export const fetchStream = (id) => async (dispatch) => {
  const response = await streams.get(`/streams/${id}`);
  dispatch({ type: FETCH_STREAM, payload: response.data });
};

export const editStream = (id, formValues) => async (dispatch) => {
  const response = await streams.patch(`/streams/${id}`, formValues);

  dispatch({ type: EDIT_STREAM, payload: response.data });
  history.push("/");
};

export const deleteStream = (id) => async (dispatch) => {
  await streams.delete(`/streams/${id}`);
  dispatch({ type: DELETE_STREAM, payload: id });
  history.push("/");
};

export const addPreference = (preference) => async (dispatch, getState) => {
  console.log("in add preference");
  const { userId } = getState().auth;
  const response = await cityguide.post("/preferences", { preference, userId });
  dispatch({ type: ADD_PREFERENCE, payload: response.data });
};

export const getPreference = () => async (dispatch, getState) => {
  console.log("in get preference");
  const { userId } = getState().auth;
  const response = await cityguide.get("/preferences");
  dispatch({ type: GET_PREFERENCE, payload: response.data });
};

export const deletePreference = (preference) => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await cityguide.delete("/preferences", {
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      preference,
      userId,
    },
  });
  dispatch({ type: DELETE_PREFERENCE, payload: response.data });
};

export const getRecommendations = () => async (dispatch) => {
  const response = await cityguide.get("/recommendations");
  dispatch({ type: GET_RECOMMENDATIONS, payload: response.data });
};

export const addFacts = (summary) => async (dispatch) => {
  const response = await cityguide.post("/addFacts", { summary });
  dispatch({ type: GET_RECOMMENDATIONS, payload: response.data });
};
