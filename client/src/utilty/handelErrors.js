import { toast } from "react-toastify";

export const handleErrors = (status) => {
  switch (status) {
    case 400:
      toast.error("Invalid credentials");
      break;
    case 404:
      toast.error("User doesn't exist");
      break;
    default:
      toast.error("Something went wrong");
      break;
  }
};
