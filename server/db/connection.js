import mongoose from "mongoose";
const URI =
  "mongodb+srv://avez3npqureshi:blogDB@cluster0.1a3hwcd.mongodb.net/?appName=Cluster0"

export const dataBaseConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DATA BASE IS CONNECTED ");
  } catch (error) {}
};
