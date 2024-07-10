import * as api from "../api";
import { FETCH_CATEGORY, FETCH_CATEGORY_ID, } from "../constants/actionTypes";

export const getCategory = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCategories();
    dispatch({ type: FETCH_CATEGORY, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchCategoryById(id);
    dispatch({ type: FETCH_CATEGORY_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};

