import * as api from "../api";
import { handleErrors } from "../../utilty/handelErrors";
import { AUTH, FETCH_USER_ID, FETCH_USER } from "../constants/actionTypes";
import { toast } from "react-toastify";
export const authSignIn = (newUser) => async (dispatch) => {
  try {
    const { data } = await api.signIn(newUser);
    dispatch({ type: AUTH, payload: data });
    toast.success("Login Sucessfully ");
  } catch (error) {
    console.log(error)
    return handleErrors(error.response.status);
  }
};

export const authSignUp = (newUser) => async (dispatch) => {
  try {
    const { data } = await api.signUp(newUser);
    dispatch({ type: AUTH, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = () => async (dispatch) => {
  try {
    const { data } = await api.getAuthor();
    dispatch({ type: FETCH_USER, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getUserByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.getAuthorById(id);
    dispatch({ type: FETCH_USER_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};
