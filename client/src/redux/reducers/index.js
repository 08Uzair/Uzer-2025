import { combineReducers } from "redux";
import blog from "./blog";
import category from "./category";
import auth from "./auth";
const rootReducer = combineReducers({
  blog,
  category,
  auth,
});

export default rootReducer;
