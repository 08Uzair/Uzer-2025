import { FETCH_CATEGORY } from "../constants/actionTypes";
export default (category = [], action) => {
  switch (action.type) {
    case FETCH_CATEGORY:
      return action.payload;
      break;
    default:
      return category;
  }
};
