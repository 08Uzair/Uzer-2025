import mongoose from "mongoose";
const URI =
  "mongodb+srv://avez3npqureshi:6a9jToU36Sf7pl4s@cluster0.1a3hwcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const dataBaseConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DATA BASE IS CONNECTED ");
  } catch (error) {}
};
 